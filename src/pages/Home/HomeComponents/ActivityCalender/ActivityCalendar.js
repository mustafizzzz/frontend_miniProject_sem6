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
    Tabs,
    Tab,
    Chip,
    Grid,
    Paper,
} from "@mui/material"
import { Plus, Trash2, CalendarIcon, Clock } from "lucide-react"

// Initial dummy data
const initialEvents = [
    { id: 1, title: "Staff Meeting", date: "2025-04-12", time: "09:00 AM", type: "meeting" },
    { id: 2, title: "Science Fair", date: "2025-04-15", time: "01:00 PM", type: "event" },
    { id: 3, title: "Parent-Teacher Conference", date: "2025-04-18", time: "03:30 PM", type: "meeting" },
    { id: 4, title: "Professional Development", date: "2025-04-20", time: "10:00 AM", type: "training" },
    { id: 5, title: "End of Term Grading Due", date: "2025-04-25", time: "05:00 PM", type: "deadline" },
]

function ActivityCalendar() {
    const [events, setEvents] = useState(initialEvents)
    const [openDialog, setOpenDialog] = useState(false)
    const [tabValue, setTabValue] = useState(0)
    const [newEvent, setNewEvent] = useState({
        title: "",
        date: "",
        time: "",
        type: "meeting",
    })

    // Add a new event
    const addEvent = () => {
        if (newEvent.title.trim() !== "" && newEvent.date.trim() !== "" && newEvent.time.trim() !== "") {
            const newItem = {
                id: Date.now(),
                title: newEvent.title,
                date: newEvent.date,
                time: newEvent.time,
                type: newEvent.type,
            }
            setEvents([...events, newItem])
            setNewEvent({
                title: "",
                date: "",
                time: "",
                type: "meeting",
            })
            setOpenDialog(false)
        }
    }

    // Delete an event
    const deleteEvent = (id) => {
        setEvents(events.filter((event) => event.id !== id))
    }

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return new Date(dateString).toLocaleDateString(undefined, options)
    }

    // Get event type color
    const getEventTypeColor = (type) => {
        switch (type) {
            case "meeting":
                return { bg: "#cfe2ff", text: "#084298" }
            case "event":
                return { bg: "#e2d9f3", text: "#5a23c8" }
            case "deadline":
                return { bg: "#f8d7da", text: "#842029" }
            case "training":
                return { bg: "#d1e7dd", text: "#0f5132" }
            default:
                return { bg: "#e2e3e5", text: "#41464b" }
        }
    }

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    return (
        <Card className="shadow">
            <CardHeader
                title="Activity Calendar for Teacher"
                action={
                    <Button variant="outlined" size="small" startIcon={<Plus size={16} />} onClick={() => setOpenDialog(true)}>
                        Add Event
                    </Button>
                }
            />
            <CardContent>
                <Tabs value={tabValue} onChange={handleTabChange} className="mb-3">
                    <Tab label="Upcoming" />
                    <Tab label="Weekly View" />
                    <Tab label="Monthly View" />
                </Tabs>

                {/* Upcoming Events Tab */}
                {tabValue === 0 && (
                    <Box>
                        {events.length === 0 ? (
                            <Box textAlign="center" py={3}>
                                <Typography color="textSecondary">No events scheduled. Add your first event!</Typography>
                            </Box>
                        ) : (
                            <Box className="space-y-3">
                                {events
                                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                                    .map((event) => {
                                        const typeColor = getEventTypeColor(event.type)

                                        return (
                                            <Box key={event.id} className="d-flex p-3 bg-light rounded">
                                                <Box
                                                    className="me-3 p-2 rounded text-center"
                                                    style={{
                                                        backgroundColor: "#e3f2fd",
                                                        color: "#0d47a1",
                                                        minWidth: "60px",
                                                    }}
                                                >
                                                    <Typography variant="caption" fontWeight="medium">
                                                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                                                    </Typography>
                                                    <Typography variant="h5" fontWeight="bold">
                                                        {new Date(event.date).getDate()}
                                                    </Typography>
                                                </Box>
                                                <Box className="flex-grow-1">
                                                    <Box className="d-flex justify-content-between align-items-center mb-1">
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {event.title}
                                                        </Typography>
                                                        <IconButton size="small" onClick={() => deleteEvent(event.id)} color="error">
                                                            <Trash2 size={16} />
                                                        </IconButton>
                                                    </Box>
                                                    <Box className="d-flex align-items-center gap-2 text-secondary">
                                                        <CalendarIcon size={14} />
                                                        <Typography variant="body2">{formatDate(event.date)}</Typography>
                                                        <Typography variant="body2">•</Typography>
                                                        <Clock size={14} />
                                                        <Typography variant="body2">{event.time}</Typography>
                                                    </Box>
                                                    <Chip
                                                        label={event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                                        size="small"
                                                        style={{
                                                            backgroundColor: typeColor.bg,
                                                            color: typeColor.text,
                                                            marginTop: "8px",
                                                        }}
                                                    />
                                                </Box>
                                            </Box>
                                        )
                                    })}
                            </Box>
                        )}
                    </Box>
                )}

                {/* Weekly View Tab */}
                {tabValue === 1 && (
                    <Grid container spacing={1}>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <Grid item xs={12 / 7} key={day}>
                                <Paper className="p-2 text-center bg-light">
                                    <Typography variant="body2" fontWeight="medium">
                                        {day}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Grid item xs={12 / 7} key={index}>
                                <Paper className="p-2" style={{ height: "120px", overflow: "auto" }}>
                                    <Typography variant="caption" color="textSecondary">
                                        {index + 10}
                                    </Typography>
                                    {index === 2 && (
                                        <Box className="p-1 mt-1 rounded" style={{ backgroundColor: "#cfe2ff", fontSize: "0.75rem" }}>
                                            Staff Meeting (9:00 AM)
                                        </Box>
                                    )}
                                    {index === 5 && (
                                        <Box className="p-1 mt-1 rounded" style={{ backgroundColor: "#e2d9f3", fontSize: "0.75rem" }}>
                                            Science Fair (1:00 PM)
                                        </Box>
                                    )}
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Monthly View Tab */}
                {tabValue === 2 && (
                    <Grid container spacing={1}>
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                            <Grid item xs={12 / 7} key={day}>
                                <Typography variant="caption" className="text-center d-block">
                                    {day}
                                </Typography>
                            </Grid>
                        ))}
                        {Array.from({ length: 35 }).map((_, index) => {
                            const isCurrentMonth = index >= 3 && index <= 33
                            const day = isCurrentMonth ? index - 2 : index < 3 ? 29 + index : index - 33

                            return (
                                <Grid item xs={12 / 7} key={index}>
                                    <Paper
                                        className="p-1"
                                        style={{
                                            height: "60px",
                                            backgroundColor: isCurrentMonth ? "white" : "#f8f9fa",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <Typography variant="caption" color={isCurrentMonth ? "textPrimary" : "textSecondary"}>
                                            {day}
                                        </Typography>
                                        {index === 10 && (
                                            <Box
                                                className="mt-1 p-1 rounded text-truncate"
                                                style={{ backgroundColor: "#cfe2ff", fontSize: "0.65rem" }}
                                            >
                                                Staff Meeting
                                            </Box>
                                        )}
                                        {index === 13 && (
                                            <Box
                                                className="mt-1 p-1 rounded text-truncate"
                                                style={{ backgroundColor: "#e2d9f3", fontSize: "0.65rem" }}
                                            >
                                                Science Fair
                                            </Box>
                                        )}
                                        {index === 16 && (
                                            <Box
                                                className="mt-1 p-1 rounded text-truncate"
                                                style={{ backgroundColor: "#cfe2ff", fontSize: "0.65rem" }}
                                            >
                                                Parent-Teacher
                                            </Box>
                                        )}
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                )}
            </CardContent>

            {/* Add Event Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add New Calendar Event</DialogTitle>
                <DialogContent>
                    <Box className="mt-2">
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Event Title"
                            fullWidth
                            variant="outlined"
                            value={newEvent.title}
                            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        />
                        <Grid container spacing={2} className="mt-1">
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    label="Date"
                                    type="date"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    margin="dense"
                                    label="Time"
                                    type="time"
                                    fullWidth
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true }}
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Event Type</InputLabel>
                            <Select
                                value={newEvent.type}
                                label="Event Type"
                                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                            >
                                <MenuItem value="meeting">Meeting</MenuItem>
                                <MenuItem value="event">Event</MenuItem>
                                <MenuItem value="deadline">Deadline</MenuItem>
                                <MenuItem value="training">Training</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={addEvent} variant="contained" color="primary">
                        Add Event
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )
}

export default ActivityCalendar
