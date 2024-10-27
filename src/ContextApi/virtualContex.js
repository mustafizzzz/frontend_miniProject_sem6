import { createContext, useRef, useState } from "react";

export const virtualContext = createContext();

const VirtualProvider = ({ children }) => {

    const [loginVirtualType, setLoginVirtualType] = useState('');
    const [virtualShowForm, setVirtualShowForm] = useState(false);
    const [studentVirtualName, setStudentVirtualName] = useState('');
    const [openImageCapture, setOpenImageCapture] = useState(false);
    const [captureStatus, setCaptureStatus] = useState(true);
    const loginButtonRef = useRef(null);


    return (

        <virtualContext.Provider value={{
            loginVirtualType, setLoginVirtualType,
            virtualShowForm, setVirtualShowForm,
            studentVirtualName, setStudentVirtualName,
            openImageCapture, setOpenImageCapture,
            captureStatus, setCaptureStatus, loginButtonRef
        }}>
            {children}
        </virtualContext.Provider>
    )
}

export default VirtualProvider;