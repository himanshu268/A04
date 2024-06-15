import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

// Utility function to set CORS headers
const setCorsHeaders = (response) => {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
};

export const GET = async (request, { params }) => {
  try {
    await connectToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");
    if (!prompt) return setCorsHeaders(new Response("Prompt Not Found", { status: 404 }));

    return setCorsHeaders(new Response(JSON.stringify(prompt), { status: 200 }));
  } catch (error) {
    console.error("GET error:", error);
    return setCorsHeaders(new Response("Internal Server Error", { status: 500 }));
  }
};

export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectToDB();

    // Find the existing prompt by ID
    const existingPrompt = await Prompt.findById(params.id);

    if (!existingPrompt) {
      return setCorsHeaders(new Response("Prompt not found", { status: 404 }));
    }

    // Update the prompt with new data
    existingPrompt.prompt = prompt;
    existingPrompt.tag = tag;

    await existingPrompt.save();

    return setCorsHeaders(new Response("Successfully updated the Prompt", { status: 200 }));
  } catch (error) {
    console.error("PATCH error:", error);
    return setCorsHeaders(new Response("Error Updating Prompt", { status: 500 }));
  }
};

export const DELETE = async (request, { params }) => {
  try {
    await connectToDB();

    // Find the prompt by ID and delete it
    await Prompt.findByIdAndDelete(params.id);

    return setCorsHeaders(new Response("Prompt deleted successfully", { status: 200 }));
  } catch (error) {
    console.error("DELETE error:", error);
    return setCorsHeaders(new Response("Error deleting prompt", { status: 500 }));
  }
};

// Handle CORS preflight requests
export const OPTIONS = async (request, { params }) => {
  return setCorsHeaders(new Response(null, { status: 204 }));
};
