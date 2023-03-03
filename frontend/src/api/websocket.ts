import io from 'socket.io-client';
import { papersTags } from '../data';

const socket = io();

// Request file from the server
socket.emit('sendFile', 'example.txt');

// Handle incoming paper data
socket.on('papers', (data) => {
    papersTags.update((papersTags) => {
        papersTags.papers = data;
        return papersTags;
    });
});
// Handle incoming tag data
socket.on('tags', (data) => {
    papersTags.update((papersTags) => {
        papersTags.tags = data;
        return papersTags;
    });
});
// Handle incoming graph data
socket.on('graph', (data) => {
    

// Handle end of file transmission
socket.on('fileEnd', () => {
  // Create a download URL for the file
  const downloadURL = URL.createObjectURL(fileBlob);

  // Create a download link and click it
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadURL;
  downloadLink.download = 'example.txt';
  downloadLink.click();
});

// Handle file errors
socket.on('fileError', (errorMessage) => {
  console.error(errorMessage);
});