import React, { useContext, useState } from 'react';
import { UserContext } from '../ContextApi/userContex';
import { ref, listAll, deleteObject } from 'firebase/storage'; // Import necessary Firebase functions
import { storage } from '../firbaseConfig';
import { set } from 'firebase/database';




const TestImageDelete = () => {
    const { currentUser } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    // Function to delete images from a specified folder in Firebase storage
    const deleteImagesFolderFromFirebase = async (storage, currentUserPid) => {
        const folderRef = ref(storage, `InCallstudentsImage/${currentUserPid}/`); // Reference to the folder

        try {
            // List all items in the folder
            const result = await listAll(folderRef);
            setLoading(true);

            if (result.items.length === 0) {
                console.log('No images to delete.'); // Log if no images are found
                setLoading(false);
                return;
            }
            const deletePromises = result.items.map(item => deleteObject(item));

            // Wait for all delete promises to resolve
            await Promise.all(deletePromises);
            console.log('All images deleted successfully.'); // Log success message
            setLoading(false);
        } catch (error) {
            console.error('Error deleting images:', error); // Log any error that occurs
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImages = async () => {
        try {
            await deleteImagesFolderFromFirebase(storage, 56985); // Call the delete function
            console.log('Images deleted successfully.'); // Log success message
        } catch (error) {
            console.error('Error deleting images:', error); // Log any error that occurs
        }
    };

    return (
        <div>
            <h2>Test Image Delete</h2>
            <button onClick={handleDeleteImages} disabled={loading}>
                Delete Images
            </button>
        </div>
    );
}

export default TestImageDelete;
