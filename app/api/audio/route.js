import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get the absolute path to the audio directory
    const audioDir = path.join(process.cwd(), 'public', 'audio');
    
    // Read all files from the directory
    const files = fs.readdirSync(audioDir);
    
    // Filter for audio files only (mp3, wav, etc.)
    const audioFiles = files.filter(file => 
      /\.(mp3|wav|ogg|aac|flac|m4a)$/i.test(file)
    );
    
    // Format the data for the frontend
    const tracks = audioFiles.map((file, index) => ({
      id: index,
      title: file.replace(/\.[^/.]+$/, ""), // Remove extension for the title
      artist: "GUTTR Artist",
      file: `/audio/${file}`,
    }));
    
    // Return the list as JSON
    return Response.json({ tracks });
  } catch (error) {
    console.error('Error fetching audio files:', error);
    return Response.json({ error: 'Failed to fetch audio files' }, { status: 500 });
  }
} 