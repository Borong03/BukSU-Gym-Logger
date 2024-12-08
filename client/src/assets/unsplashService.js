import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const ACCESS_KEY = "hDqf5I61LOu7Kr3qvBpLlrYPiJ6wPXxGo2Hmf9Ffm3E"; // Replace with your API key

export const fetchRandomGymImage = async () => {
  try {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query: "mesh gradient",
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });

    return response.data.urls.small; // small kay gamay ra ang size
  } catch (error) {
    console.error("Error fetching random image from Unsplash:", error);
    return null; // return to default if naay error
  }
};
