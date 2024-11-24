import axios from "axios";

const UNSPLASH_API_URL = "https://api.unsplash.com/photos/random";
const ACCESS_KEY = "hDqf5I61LOu7Kr3qvBpLlrYPiJ6wPXxGo2Hmf9Ffm3E"; // Replace with your API key

export const fetchRandomGymImage = async () => {
  try {
    const response = await axios.get(UNSPLASH_API_URL, {
      params: {
        query: "gym",
        orientation: "landscape",
      },
      headers: {
        Authorization: `Client-ID ${ACCESS_KEY}`,
      },
    });
    // Use 'urls.regular' or 'urls.small' for lower resolution
    return response.data.urls.regular; // Lower resolution, ideal for blurred backgrounds
  } catch (error) {
    console.error("Error fetching random image from Unsplash:", error);
    return null; // Fallback in case of an error
  }
};
