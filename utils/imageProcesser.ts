import { deleteAsync } from "expo-file-system";
import {
  SaveFormat,
  SaveOptions,
  manipulateAsync,
} from "expo-image-manipulator";

export const resizeImage = async (imageUri: string) => {
  const actions = [
    {
      resize: {
        width: 550,
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
    console.log(JSON.stringify(err).slice(0, 30));
  }
  return processedImage;
};
