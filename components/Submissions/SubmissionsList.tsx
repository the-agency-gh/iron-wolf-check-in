import { FC, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { View, FlatList, Text, StyleSheet } from "react-native";

//----------------funcs
import { deleteSubmission, retrieveSubmissions, SubmissionProps } from "../../utils/database";
//----------------components
import LoadingView from "../LoadingView";
import { colors } from "../../styles/variables";
import SubmissionCard from "./parts/SubmissionCard";
import { deleteAsync } from "expo-file-system";

interface SubmissionsListProps {}
type fetchedSubmission = SubmissionProps & { id: number };
const SubmissionsList: FC<SubmissionsListProps> = () => {
  const [submissions, setSubmissions] = useState<fetchedSubmission[]>([]);
  const { isLoading, error } = useQuery({
    queryKey: ["previousSubmissionsData"],
    queryFn: async () => {
      const subData = await retrieveSubmissions();
      return {
        submissions: (subData as fetchedSubmission[]) || undefined,
      };
    },
    onSuccess: (data: { submissions: fetchedSubmission[] }) => {
      setSubmissions(data.submissions);
    },
  });
  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingView />
      </View>
    );
  }
  const handleDelete = (data: fetchedSubmission, index: number) => {
    setSubmissions((prev) => prev.filter((_, i) => i !== index));
    deleteAsync(data.pdfUri, { idempotent: true });
    deleteAsync(data.profileUri, { idempotent: true });
    deleteAsync(data.photoIdUri, { idempotent: true });
    deleteSubmission(data.id);
  };
  return (
    <View style={styles.container}>
      {error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.white }}>Sorry Error Occured</Text>
        </View>
      ) : submissions.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: colors.white, fontWeight: "bold", fontSize: 25 }}>No Submissions</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlatList
            style={styles.listContainer}
            data={submissions}
            keyExtractor={(item) => `${item.firstName}-${item.lastName}-${item.dateOfBirth}`}
            renderItem={({ item, index }) => <SubmissionCard data={item} index={index} handleDelete={handleDelete} />}
          />
        </View>
      )}
    </View>
  );
};

export default SubmissionsList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  listContainer: {},
});
