import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
}

// Define a custom hook for updating the profile
const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  async function updateUserData(data) {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/user/editprofile",
        data
      );
      console.log(response);
      if (response.status === 200) {
        return response.data.data;
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.log(error);
      throw new Error("Error logging in");
    }
  }

  const { mutateAsync, isLoading, isSuccess } = useMutation(updateUserData, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // Define a function to handle the updateProfile action
  const updateProfile = async (formData: ProfileFormData) => {
    // Call the mutation function with the form data
    try {
      await mutateAsync(formData);
      // console.log(data);
    } catch (error) {
      console.log(error);
      console.error("mutate error");
    }

    // Return the updated profile data
  };

  return { updateProfile, isLoading, isSuccess };
};

export default useUpdateProfile;
