import { deleteObject, listAll, ref } from "firebase/storage";
import { storage } from "../firbaseConfig";




// export const deleteStudentImage = async (roomId = '123', currentUserPid) => {

//     const folderRef = ref(storage, `InCallstudentsImage/${currentUserPid}/`); // Reference to the folder
//     console.log('Deleting images...', roomId, currentUserPid);


//     try {
//         // List all items in the folder asynchronously (non-blocking)
//         listAll(folderRef)
//             .then((result) => {
//                 if (result.items.length === 0) {
//                     console.log('No images to delete.'); // Log if no images are found
//                     return;
//                 }

//                 // Map each item to a delete request
//                 const deletePromises = result.items.map((item) => deleteObject(item));

//                 // Execute delete in the background without awaiting
//                 Promise.all(deletePromises)
//                     .then(() => {
//                         console.log(`All images deleted successfully form roomID:${roomId} of StudentPID:${currentUserPid}.`); // Log success message
//                         alert("All images deleted successfully.")
//                     })
//                     .catch((error) => {
//                         console.error('Error deleting images:', error); // Log any deletion error
//                         alert("error in deleting images.")
//                     });
//             })
//             .catch((error) => {
//                 console.error('Error listing images:', error); // Log any error that occurs while listing items
//             });

//     } catch (error) {
//         console.error('Error deleting images:', error); // Log any error that occurs
//     }

// }


// export const deleteStudentImage = async (roomId = '123', currentUserPid) => {
//     const folderRef = ref(storage, `InCallstudentsImage/${currentUserPid}/`);
//     console.log('Deleting images...', roomId, currentUserPid);

//     try {
//         // Await the listing of all items
//         const result = await listAll(folderRef);

//         if (result.items.length === 0) {
//             console.log('No images to delete.');
//             return;
//         }

//         // Await the deletion of all items
//         await Promise.all(result.items.map((item) => deleteObject(item)));

//         console.log(`All images deleted successfully from roomID:${roomId} of StudentPID:${currentUserPid}.`);
//         alert("All images deleted successfully.");

//     } catch (error) {
//         console.error('Error deleting images:', error);
//         alert("Error in deleting images.");
//     }
// };


export const deleteStudentImage = async (roomId = '123', currentUserPid) => {
    const folderRef = ref(storage, `InCallstudentsImage/${currentUserPid}/`);
    console.log('Deleting images...', roomId, currentUserPid);

    try {
        const result = await listAll(folderRef);

        if (result.items.length === 0) {
            console.log('No images to delete.');
            return;
        }

        // Sequentially delete each item
        for (const item of result.items) {
            try {
                await deleteObject(item);
                console.log(`Deleted: ${item.fullPath}`);
            } catch (error) {
                if (error.code === 'storage/object-not-found') {
                    console.warn(`File not found: ${item.fullPath}`);
                } else {
                    console.error(`Error deleting ${item.fullPath}:`, error);
                    alert("Error in deleting images.");
                    return; // Exit on unexpected error
                }
            }
        }

        console.log(`All deletable images removed from roomID:${roomId}, StudentPID:${currentUserPid}.`);
        alert("All deletable images removed successfully.");

    } catch (error) {
        console.error('Failed to delete some or all images:', error);
        alert("Some images may not have been deleted. Check console for details.");
    } finally {
        await new Promise(resolve => setTimeout(resolve, 4000)); // Wait for 1 second before redirecting
        window.location.href = '/dashboard/home';
    }
};
