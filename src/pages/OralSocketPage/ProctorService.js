import React from 'react'
import { useEffect, useState } from "react"
import { Alert, Snackbar } from "@mui/material"

const ProctorService = ({ onViolation, isExamActive }) => {
    const [tabViolations, setTabViolations] = useState(0)
    const [resizeViolations, setResizeViolations] = useState(0)
    const [alert, setAlert] = useState({ open: false, message: "", severity: "warning" })
    const [originalSize, setOriginalSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    // Handle tab visibility change
    useEffect(() => {
        if (!isExamActive) return

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setTabViolations((prev) => prev + 1)
                onViolation("tab_switch", "User switched to another tab")
                setAlert({
                    open: true,
                    message: "Warning: Switching tabs during the exam is not allowed!",
                    severity: "error",
                })
            }
        }

        document.addEventListener("visibilitychange", handleVisibilityChange)
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange)
        }
    }, [isExamActive, onViolation])

    // Handle window resize
    useEffect(() => {
        if (!isExamActive) return

        const handleResize = () => {
            const currentWidth = window.innerWidth
            const currentHeight = window.innerHeight

            // Check if the resize is significant (more than 10% change)
            const widthChange = Math.abs(currentWidth - originalSize.width) / originalSize.width
            const heightChange = Math.abs(currentHeight - originalSize.height) / originalSize.height

            if (widthChange > 0.1 || heightChange > 0.1) {
                setResizeViolations((prev) => prev + 1)
                onViolation("screen_resize", "User resized the screen")
                setAlert({
                    open: true,
                    message: "Warning: Resizing the window during the exam is not allowed!",
                    severity: "error",
                })

                // Update the original size to prevent multiple alerts for the same resize
                setOriginalSize({ width: currentWidth, height: currentHeight })
            }
        }

        window.addEventListener("resize", handleResize)
        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [isExamActive, originalSize, onViolation])

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false })
    }

    return (
        <Snackbar
            open={alert.open}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: "100%" }}>
                {alert.message}
            </Alert>
        </Snackbar>
    )
}

export default ProctorService