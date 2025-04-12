import { useState } from "react"
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    TextField,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
} from "@mui/material"
import { Plus, Trash2, Bell } from "lucide-react"

// Initial dummy data
const initialAnnouncements = [
    {
        id: 1,
        title: "Final Exam Schedule",
        content: "Final exams will be held from May 15-20. Please check the schedule and prepare accordingly.",
        date: "2025-04-10",
        priority: "high",
    },
    {
        id: 2,
        title: "Field Trip Permission Forms",
        content: "Please submit your permission forms for the science museum field trip by Friday.",
        date: "2025-04-08",
        priority: "medium",
    },
    {
        id: 3,
        title: "Holiday Break",
        content: "School will be closed for spring break from April 15-22. Classes will resume on April 23.",
        date: "2025-04-05",
        priority: "low",
    },
]

function ImportantAnnouncements() {
    const [announcements, setAnnouncements] = useState(initialAnnouncements)
    const [openDialog, setOpenDialog] = useState(false)
    const [newAnnouncement, setNewAnnouncement] = useState({
        title: "",
        content: "",
        priority: "medium",
    })

    // Add a new announcement
    const addAnnouncement = () => {
        if (newAnnouncement.title.trim() !== "" && newAnnouncement.content.trim() !== "") {
            const newItem = {
                id: Date.now(),
                title: newAnnouncement.title,
                content: newAnnouncement.content,
                date: new Date().toISOString().split("T")[0],
                priority: newAnnouncement.priority,
            }
            setAnnouncements([...announcements, newItem])
            setNewAnnouncement({
                title: "",
                content: "",
                priority: "medium",
            })
            setOpenDialog(false)
        }
    }

    // Delete an announcement
    const deleteAnnouncement = (id) => {
        setAnnouncements(announcements.filter((announcement) => announcement.id !== id))
    }

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Get priority color
    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high":
                return { bg: "#f8d7da", text: "#721c24" }
            case "medium":
                return { bg: "#fff3cd", text: "#856404" }
            case "low":
                return { bg: "#d4edda", text: "#155724" }
            default:
                return { bg: "#e2e3e5", text: "#383d41" }
        }
    }

    return (
        <Card className="shadow">
            <CardHeader
                title="Important Announcements for Student"
                action={
                    <Button variant="outlined" size="small" startIcon={<Plus size={16} />} onClick={() => setOpenDialog(true)}>
                        Add Announcement
                    </Button>
                }
            />
            <CardContent>
                {announcements.length === 0 ? (
                    <Box textAlign="center" py={3}>
                        <Typography color="textSecondary">No announcements yet. Create your first announcement!</Typography>
                    </Box>
                ) : (
                    <Box className="space-y-3">
                        {announcements.map((announcement) => {
                            const priorityColor = getPriorityColor(announcement.priority)

                            return (
                                <Box key={announcement.id} className="p-3 bg-light rounded">
                                    <Box className="d-flex justify-content-between align-items-center mb-2">
                                        <Box className="d-flex align-items-center gap-2">
                                            <Bell size={16} color="#1976d2" />
                                            <Typography variant="subtitle1" component="h3" fontWeight="medium">
                                                {announcement.title}
                                            </Typography>
                                            <Chip
                                                label={announcement.priority}
                                                size="small"
                                                style={{
                                                    backgroundColor: priorityColor.bg,
                                                    color: priorityColor.text,
                                                }}
                                            />
                                        </Box>
                                        <IconButton size="small" onClick={() => deleteAnnouncement(announcement.id)} color="error">
                                            <Trash2 size={16} />
                                        </IconButton>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" className="mb-2">
                                        {announcement.content}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        Posted on {formatDate(announcement.date)}
                                    </Typography>
                                </Box>
                            )
                        })}
                    </Box>
                )}
            </CardContent>

            {/* Add Announcement Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Announcement</DialogTitle>
                <DialogContent>
                    <Box className="mt-2">
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Title"
                            fullWidth
                            variant="outlined"
                            value={newAnnouncement.title}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Content"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            value={newAnnouncement.content}
                            onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Priority</InputLabel>
                            <Select
                                value={newAnnouncement.priority}
                                label="Priority"
                                onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={addAnnouncement} variant="contained" color="primary">
                        Publish
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default ImportantAnnouncements
