import { manipulateAsync, SaveOptions, SaveFormat } from "expo-image-manipulator";
import { deleteAsync } from "expo-file-system";

export const resizeImage = async (imageUri: string) => {
  const actions = [
    {
      resize: {
        width: 750,
      },
    },
  ];
  const options: SaveOptions = {
    base64: true,
    format: SaveFormat.JPEG,
  };
  const processedImage = await manipulateAsync(imageUri, actions, options);
  try {
    await deleteAsync(imageUri);
  } catch (err) {
    console.log(err);
  }
  return processedImage;
};
