import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
} from "@mui/material"
import {
  Search,
  FileText,
  Video,
  Mic,
  MessageSquare,
  Download,
  Eye,
  Calendar,
  Users,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Sample data from the API response
const meetingReportsData = [
  {
    _id: "65f89379514a6efd2c54d83d",
    meet_id: 12345,
    host_id: 5123,
    title: "T Lecture",
    description: "Max Word is 50",
    startTime: "00:48",
    host_name: "mustafiz",
    text_emotions: [
      {
        happy: 2,
        surprised: 0,
        confused: 1,
        bored: 0,
        pnf: 0,
      },
    ],
    video_emotions: [
      {
        happy: 3,
        surprised: 3,
        confused: 3,
        bored: 0,
        pnf: 0,
      },
    ],
    audio_emotions: [
      {
        happy: 17,
        surprised: 0,
        confused: 0,
        bored: 0,
        pnf: 0,
      },
    ],
    __v: 0,
    numberOfAttendees: 2,
  },
  {
    _id: "65f893e6514a6efd2c54d840",
    meet_id: 3118,
    host_id: 5123,
    title: "testLec",
    description: "MAximum word is chria",
    startTime: "00:50",
    host_name: "mustafiz",
    text_emotions: [
      {
        happy: 0,
        surprised: 0,
        confused: 0,
        bored: 0,
        pnf: 0,
      },
    ],
    video_emotions: [
      {
        happy: 0,
        surprised: 0,
        confused: 0,
        bored: 0,
        pnf: 0,
      },
    ],
    audio_emotions: [
      {
        happy: 0,
        surprised: 0,
        confused: 0,
        bored: 0,
        pnf: 0,
      },
    ],
    __v: 0,
    numberOfAttendees: 0,
  },
]

const notesData = [
  {
    _id: "67117a9a8672e5600e69d2d5",
    meet_id: 12345,
    aiNotes:
      "The lecture is about computer network security. The speaker discusses the syllabus and how it is structured. There will be 3 lectures per week and 2 hours of practical. There are 2 internal assessments and an oral and practical exam. There are 4 recommended textbooks:\n1. Mark Stamp's 'Information Security Principles and Practices', Wiley\n2. William Stallings' 'Cryptography and Network Security: Principles and Practice', 8th Edition, Pearson Education, March 2015\n3. Behrouz A. Forouzan's 'Cryptography & Network Security', Tata Mc Graw Hill\n4. Bernard Menezes' 'Cryptography & Network Security', Cengage Learning\n\nThe speaker then goes on to explain the concepts of computer security and network security. She defines security as the measures adopted to prevent unauthorized use or modification of knowledge, data or facts. The goals of computer security are Confidentiality, Integrity, and Availability, often abbreviated as CIA. Finally, she explains that there are three broad classes of security control: physical, technical, and administrative. ",
    pdfUrl: "",
    __v: 0,
  },
  {
    _id: "67151dba6920c043d28ea6ed",
    meet_id: 3269,
    aiNotes:
      "Here are detailed notes of the lecture:\n\n**Computer Network Security (ITC 502)**\n\n**Subject In-charge**\n* Amrita Mathur, Assistant Professor, Room No. 303, email: amritamathur@nitj.ac.in\n\n**Course Structure**\nThe course is divided into two main parts: \n1. **Computer Security**: This deals with the security of stand-alone systems, like personal laptops or individual computers. It involves protecting these systems from threats and ensuring their proper functioning.\n2. **Network Security**: This focuses on securing the communication channels and data flow over networks, particularly the internet. It covers the security measures required to protect data transmitted across networks, such as during online transactions, communication, and online activities.\n\n**Importance of Computer and Network Security**\nThe study of computer and network security is crucial in today's world as our reliance on digital systems and networks has increased significantly. Here's why:\n\n* **Beyond Virus Protection:** While the initial understanding of security might be limited to virus protection, the subject delves deeper into various other threats that can harm computer systems and networks.\n\n* **Network-Centric World:** Most daily activities, including banking, shopping, communication, and even education, have shifted online. This makes network security paramount to protect sensitive data transmitted over networks.\n\n* **Research and Development:** Despite advancements in security measures, constant research and development are required to stay ahead of evolving threats and vulnerabilities. \n\n**Course Outcomes**\nThis course aims to equip students with a comprehensive understanding of the fundamental concepts and practices related to computer and network security. By the end of the semester, students will be able to:\n\n* **Explain the fundamental concepts of computer and network security.** \n* **Identify the base cryptographic techniques using classical and block encryption methods.**\n* **Study and describe the system security malicious software.**\n* **Describe the Network layer security, Transport layer security, and application layer security.**\n* **Explain the need of network management security and illustrate the need for NAC.**\n* **Identify the functions of an IDS and firewall for the system security.**\n\n**Key Concepts**\n1. **Understanding Security:** Security is not a one-size-fits-all concept. It varies depending on the system, application, and the specific requirements for protection. The course will explore how the definition of security adapts to different scenarios and applications.\n\n2. **Identifying Threats and Vulnerabilities:** To implement effective security measures, it's crucial to identify potential threats and vulnerabilities. Students will learn how to assess the types of attacks that could happen to a system and the vulnerabilities that could be exploited.\n\n**Course Evaluation**\n\n* **Internal Assessment (20 marks):** Includes two internal assessment tests (IA1 and IA2)\n* **Assignment Tests (20 marks):** There will be two assignment tests.\n* **Oral and Practical Examination (60 marks):** Previously, only an oral exam was conducted for this subject. Now, a practical examination component has been added, reflecting the subject's importance and the need for hands-on experience in real-world applications.\n\n**Self-Learning**\n\nThe course will also encourage self-learning. Students will be given assignments on various topics to research and study independently. This fosters deeper understanding and exploration beyond the core syllabus.\n\n**Practical Applications**\nThe lecture highlights the practical relevance of the course.  Real-world applications like Gmail, Google, and wireless networks (WiFi) will be used as examples to illustrate how security concepts are implemented in our daily lives. Understanding the technical aspects of securing these applications will be covered.\n\nThe professor concludes by emphasizing the significance of computer and network security in today's interconnected world. The course, with its comprehensive syllabus and practical examination, is designed to meet the growing demands of this field.\n",
    pdfUrl: "",
    __v: 0,
  },
]

function ReportsPage() {
  const [tabValue, setTabValue] = useState(0)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMeeting, setSelectedMeeting] = useState(null)
  const [selectedNotes, setSelectedNotes] = useState(null)
  const [openEmotionsDialog, setOpenEmotionsDialog] = useState(false)
  const [openNotesDialog, setOpenNotesDialog] = useState(false)

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted data
  const getSortedData = (data) => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Filter data based on search term
  const getFilteredMeetingReports = () => {
    return getSortedData(meetingReportsData).filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.host_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.meet_id.toString().includes(searchTerm),
    )
  }

  const getFilteredNotes = () => {
    return getSortedData(notesData).filter(
      (note) =>
        note.meet_id.toString().includes(searchTerm) || note.aiNotes.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Calculate total emotions
  const calculateTotalEmotions = (emotions) => {
    return emotions.happy + emotions.surprised + emotions.confused + emotions.bored + emotions.pnf
  }

  // Get dominant emotion
  const getDominantEmotion = (emotions) => {
    const emotionValues = {
      happy: emotions.happy,
      surprised: emotions.surprised,
      confused: emotions.confused,
      bored: emotions.bored,
      pnf: emotions.pnf,
    }

    const maxEmotion = Object.keys(emotionValues).reduce((a, b) => (emotionValues[a] > emotionValues[b] ? a : b))

    return maxEmotion
  }

  // Get emotion color
  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "happy":
        return { bg: "#d4edda", text: "#155724" }
      case "surprised":
        return { bg: "#fff3cd", text: "#856404" }
      case "confused":
        return { bg: "#f8d7da", text: "#721c24" }
      case "bored":
        return { bg: "#e2e3e5", text: "#383d41" }
      case "pnf":
        return { bg: "#d1ecf1", text: "#0c5460" }
      default:
        return { bg: "#e2e3e5", text: "#383d41" }
    }
  }

  // Truncate text
  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  // View emotions details
  const viewEmotionsDetails = (meeting) => {
    setSelectedMeeting(meeting)
    setOpenEmotionsDialog(true)
  }

  // View notes details
  const viewNotesDetails = (notes) => {
    setSelectedNotes(notes)
    setOpenNotesDialog(true)
  }

  // Sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === "ascending" ? (
      <ChevronUp size={16} className="ms-1" />
    ) : (
      <ChevronDown size={16} className="ms-1" />
    )
  }

  return (

    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Typography variant="h4" component="h1">
          Reports
        </Typography>
        <TextField
          placeholder="Search reports..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          sx={{ width: "300px" }}
        />
      </div>

      <Card className="shadow">
        <CardHeader
          title={
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab
                label={
                  <Box className="d-flex align-items-center">
                    <Video size={16} className="me-2" />
                    Meeting Reports
                  </Box>
                }
              />
              <Tab
                label={
                  <Box className="d-flex align-items-center">
                    <FileText size={16} className="me-2" />
                    Lecture Notes
                  </Box>
                }
              />
            </Tabs>
          }
        />
        <CardContent>
          {/* Meeting Reports Tab */}
          {tabValue === 0 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => requestSort("meet_id")} style={{ cursor: "pointer" }} className="fw-bold">
                      <Box className="d-flex align-items-center">Meeting ID {getSortIndicator("meet_id")}</Box>
                    </TableCell>
                    <TableCell onClick={() => requestSort("title")} style={{ cursor: "pointer" }} className="fw-bold">
                      <Box className="d-flex align-items-center">Title {getSortIndicator("title")}</Box>
                    </TableCell>
                    <TableCell
                      onClick={() => requestSort("host_name")}
                      style={{ cursor: "pointer" }}
                      className="fw-bold"
                    >
                      <Box className="d-flex align-items-center">Host {getSortIndicator("host_name")}</Box>
                    </TableCell>
                    <TableCell
                      onClick={() => requestSort("startTime")}
                      style={{ cursor: "pointer" }}
                      className="fw-bold"
                    >
                      <Box className="d-flex align-items-center">Start Time {getSortIndicator("startTime")}</Box>
                    </TableCell>
                    <TableCell
                      onClick={() => requestSort("numberOfAttendees")}
                      style={{ cursor: "pointer" }}
                      className="fw-bold"
                    >
                      <Box className="d-flex align-items-center">Attendees {getSortIndicator("numberOfAttendees")}</Box>
                    </TableCell>
                    <TableCell className="fw-bold">Text Emotions</TableCell>
                    <TableCell className="fw-bold">Video Emotions</TableCell>
                    <TableCell className="fw-bold">Audio Emotions</TableCell>
                    <TableCell className="fw-bold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredMeetingReports().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} align="center">
                        No meeting reports found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredMeetingReports().map((report) => {
                      const textEmotions = report.text_emotions[0]
                      const videoEmotions = report.video_emotions[0]
                      const audioEmotions = report.audio_emotions[0]

                      const dominantTextEmotion = getDominantEmotion(textEmotions)
                      const dominantVideoEmotion = getDominantEmotion(videoEmotions)
                      const dominantAudioEmotion = getDominantEmotion(audioEmotions)

                      const textEmotionColor = getEmotionColor(dominantTextEmotion)
                      const videoEmotionColor = getEmotionColor(dominantVideoEmotion)
                      const audioEmotionColor = getEmotionColor(dominantAudioEmotion)

                      const totalTextEmotions = calculateTotalEmotions(textEmotions)
                      const totalVideoEmotions = calculateTotalEmotions(videoEmotions)
                      const totalAudioEmotions = calculateTotalEmotions(audioEmotions)

                      return (
                        <TableRow key={report._id} hover>
                          <TableCell>{report.meet_id}</TableCell>
                          <TableCell>{report.title}</TableCell>
                          <TableCell>{report.host_name}</TableCell>
                          <TableCell>{report.startTime}</TableCell>
                          <TableCell>{report.numberOfAttendees}</TableCell>
                          <TableCell>
                            {totalTextEmotions > 0 ? (
                              <Chip
                                label={dominantTextEmotion}
                                size="small"
                                style={{
                                  backgroundColor: textEmotionColor.bg,
                                  color: textEmotionColor.text,
                                }}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No data
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {totalVideoEmotions > 0 ? (
                              <Chip
                                label={dominantVideoEmotion}
                                size="small"
                                style={{
                                  backgroundColor: videoEmotionColor.bg,
                                  color: videoEmotionColor.text,
                                }}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No data
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {totalAudioEmotions > 0 ? (
                              <Chip
                                label={dominantAudioEmotion}
                                size="small"
                                style={{
                                  backgroundColor: audioEmotionColor.bg,
                                  color: audioEmotionColor.text,
                                }}
                              />
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No data
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Eye size={16} />}
                              onClick={() => viewEmotionsDetails(report)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Lecture Notes Tab */}
          {tabValue === 1 && (
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell onClick={() => requestSort("meet_id")} style={{ cursor: "pointer" }} className="fw-bold">
                      <Box className="d-flex align-items-center">Meeting ID {getSortIndicator("meet_id")}</Box>
                    </TableCell>
                    <TableCell className="fw-bold">AI Notes</TableCell>
                    <TableCell className="fw-bold">PDF</TableCell>
                    <TableCell className="fw-bold">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredNotes().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No lecture notes found
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredNotes().map((note) => (
                      <TableRow key={note._id} hover>
                        <TableCell>{note.meet_id}</TableCell>
                        <TableCell>{truncateText(note.aiNotes, 150)}</TableCell>
                        <TableCell>
                          {note.pdfUrl ? (
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<Download size={16} />}
                              href={note.pdfUrl}
                              target="_blank"
                            >
                              Download
                            </Button>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No PDF
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Eye size={16} />}
                            onClick={() => viewNotesDetails(note)}
                          >
                            View Notes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Emotions Details Dialog */}
      <Dialog open={openEmotionsDialog} onClose={() => setOpenEmotionsDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          <Box className="d-flex justify-content-between align-items-center">
            <Typography variant="h6">
              Meeting Emotions: {selectedMeeting?.title} (ID: {selectedMeeting?.meet_id})
            </Typography>
            <Box className="d-flex align-items-center gap-3">
              <Box className="d-flex align-items-center">
                <Calendar size={16} className="me-1" />
                <Typography variant="body2">Start Time: {selectedMeeting?.startTime}</Typography>
              </Box>
              <Box className="d-flex align-items-center">
                <Users size={16} className="me-1" />
                <Typography variant="body2">Attendees: {selectedMeeting?.numberOfAttendees}</Typography>
              </Box>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedMeeting && (
            <Box className="mt-2">
              <Typography variant="subtitle1" className="mb-3">
                {selectedMeeting.description}
              </Typography>

              <Box className="row g-4">
                {/* Text Emotions */}
                <Box className="col-md-4">
                  <Card>
                    <CardHeader
                      title={
                        <Box className="d-flex align-items-center">
                          <MessageSquare size={18} className="me-2" />
                          <Typography variant="subtitle1">Text Emotions</Typography>
                        </Box>
                      }
                      className="pb-0"
                    />
                    <CardContent>
                      <Box className="d-flex flex-column gap-2">
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Happy</Typography>
                          <Typography variant="body2">{selectedMeeting.text_emotions[0].happy}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Surprised</Typography>
                          <Typography variant="body2">{selectedMeeting.text_emotions[0].surprised}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Confused</Typography>
                          <Typography variant="body2">{selectedMeeting.text_emotions[0].confused}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Bored</Typography>
                          <Typography variant="body2">{selectedMeeting.text_emotions[0].bored}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Not Found</Typography>
                          <Typography variant="body2">{selectedMeeting.text_emotions[0].pnf}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Video Emotions */}
                <Box className="col-md-4">
                  <Card>
                    <CardHeader
                      title={
                        <Box className="d-flex align-items-center">
                          <Video size={18} className="me-2" />
                          <Typography variant="subtitle1">Video Emotions</Typography>
                        </Box>
                      }
                      className="pb-0"
                    />
                    <CardContent>
                      <Box className="d-flex flex-column gap-2">
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Happy</Typography>
                          <Typography variant="body2">{selectedMeeting.video_emotions[0].happy}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Surprised</Typography>
                          <Typography variant="body2">{selectedMeeting.video_emotions[0].surprised}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Confused</Typography>
                          <Typography variant="body2">{selectedMeeting.video_emotions[0].confused}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Bored</Typography>
                          <Typography variant="body2">{selectedMeeting.video_emotions[0].bored}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Not Found</Typography>
                          <Typography variant="body2">{selectedMeeting.video_emotions[0].pnf}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                {/* Audio Emotions */}
                <Box className="col-md-4">
                  <Card>
                    <CardHeader
                      title={
                        <Box className="d-flex align-items-center">
                          <Mic size={18} className="me-2" />
                          <Typography variant="subtitle1">Audio Emotions</Typography>
                        </Box>
                      }
                      className="pb-0"
                    />
                    <CardContent>
                      <Box className="d-flex flex-column gap-2">
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Happy</Typography>
                          <Typography variant="body2">{selectedMeeting.audio_emotions[0].happy}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Surprised</Typography>
                          <Typography variant="body2">{selectedMeeting.audio_emotions[0].surprised}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Confused</Typography>
                          <Typography variant="body2">{selectedMeeting.audio_emotions[0].confused}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Bored</Typography>
                          <Typography variant="body2">{selectedMeeting.audio_emotions[0].bored}</Typography>
                        </Box>
                        <Box className="d-flex justify-content-between">
                          <Typography variant="body2">Not Found</Typography>
                          <Typography variant="body2">{selectedMeeting.audio_emotions[0].pnf}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              {/* Emotion Summary */}
              <Box className="mt-4">
                <Typography variant="subtitle1" className="mb-2">
                  Emotion Summary
                </Typography>
                <Paper className="p-3">
                  <Typography variant="body2">
                    This meeting had a total of {selectedMeeting.numberOfAttendees} attendees. The dominant emotions
                    were:
                  </Typography>
                  <Box className="d-flex gap-3 mt-2">
                    <Chip
                      label={`Text: ${getDominantEmotion(selectedMeeting.text_emotions[0])}`}
                      size="small"
                      style={{
                        backgroundColor: getEmotionColor(getDominantEmotion(selectedMeeting.text_emotions[0])).bg,
                        color: getEmotionColor(getDominantEmotion(selectedMeeting.text_emotions[0])).text,
                      }}
                    />
                    <Chip
                      label={`Video: ${getDominantEmotion(selectedMeeting.video_emotions[0])}`}
                      size="small"
                      style={{
                        backgroundColor: getEmotionColor(getDominantEmotion(selectedMeeting.video_emotions[0])).bg,
                        color: getEmotionColor(getDominantEmotion(selectedMeeting.video_emotions[0])).text,
                      }}
                    />
                    <Chip
                      label={`Audio: ${getDominantEmotion(selectedMeeting.audio_emotions[0])}`}
                      size="small"
                      style={{
                        backgroundColor: getEmotionColor(getDominantEmotion(selectedMeeting.audio_emotions[0])).bg,
                        color: getEmotionColor(getDominantEmotion(selectedMeeting.audio_emotions[0])).text,
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmotionsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Notes Details Dialog */}
      <Dialog open={openNotesDialog} onClose={() => setOpenNotesDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>
          <Box className="d-flex justify-content-between align-items-center">
            <Typography variant="h6">Lecture Notes: Meeting ID {selectedNotes?.meet_id}</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedNotes && (
            <Box className="mt-2">
              <Paper className="p-4" style={{ whiteSpace: "pre-wrap" }}>
                {selectedNotes.aiNotes}
              </Paper>
              {selectedNotes.pdfUrl && (
                <Box className="mt-3 text-center">
                  <Button variant="contained" startIcon={<Download />} href={selectedNotes.pdfUrl} target="_blank">
                    Download PDF
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotesDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ReportsPage
