import * as React from 'react';
import './AssesmentsPage.css';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { useState } from 'react';
import CreateAssesments from './AssesmentsComponents/CreateAssesments';
import LiveAssesments from './AssesmentsComponents/LiveAssesments';
import PastAssesments from './AssesmentsComponents/PastAssesments';
import { useEffect } from 'react';
import axios from 'axios';
import { REACT_APP_DEPLOY } from '../../config';
import { useContext } from 'react';
import { UserContext } from '../../ContextApi/userContex';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';



// Create a local query client
const queryClient = new QueryClient();

// All fetchers
const fetchLectureNotes = async (hostId) => {
	const res = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/fetch_lecture_with_notes`, { host_id: hostId });
	return res.data;
};

const fetchTeacherLiveAssesments = async (hostId) => {
	const res = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/view_live_tests`, { createdBy: hostId });
	return res.data;
};

const fetchTeacherPastAssesments = async (hostId) => {
	const res = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/view_past_tests`, { createdBy: hostId });
	return res.data;
};

const fetchStudentLiveAssesments = async () => {
	const res = await axios.get(`${REACT_APP_DEPLOY}/api/v1/student_test/view_live_tests`);
	return res.data;
};

const fetchStudentPastAssesments = async () => {
	const res = await axios.get(`${REACT_APP_DEPLOY}/api/v1/student_test/view_past_tests`);
	return res.data;
};


const AssesmentsInner = () => {
	const { currentUser } = useContext(UserContext);
	const [value, setValue] = useState(currentUser.role === 'student' ? '2' : '1');

	const handleChange = (event, newValue) => setValue(newValue);

	const {
		data: lectureNotes = [],
		isLoading: isNotesLoading,
		isError: isNotesError
	} = useQuery({
		queryKey: ['lectureNotes'],
		queryFn: () => fetchLectureNotes(currentUser.hostId),
		enabled: currentUser.role === 'teacher'
	});

	const {
		data: liveAssesments = [],
		isLoading: isLiveLoading,
		isError: isLiveError,
		refetch: refetchLive
	} = useQuery({
		queryKey: ['liveAssesments'],
		queryFn: () => currentUser.role === 'teacher'
			? fetchTeacherLiveAssesments(currentUser.hostId)
			: fetchStudentLiveAssesments()
	});

	const {
		data: pastAssesments = [],
		isLoading: isPastLoading,
		isError: isPastError
	} = useQuery({
		queryKey: ['pastAssesments'],
		queryFn: () => currentUser.role === 'teacher'
			? fetchTeacherPastAssesments(currentUser.hostId)
			: fetchStudentPastAssesments()
	});

	const deleteCreatedAssesment = (lectureId) => {
		lectureNotes = lectureNotes.filter(lecture => lecture.lectureId !== lectureId);
		// Only local state logic;
	};

	console.log('liveAssesment:', liveAssesments);


	return (
		<Box sx={{ width: '100%' }}>
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white', borderRadius: '1rem' }}>
					<TabList onChange={handleChange} aria-label="assessment tabs" centered className='assesments-tabs'>
						{currentUser.role !== 'student' && (
							<Tab label="Create Assesments" value="1" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
						)}
						<Tab label="Live Assessments" value="2" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
						<Tab label="Past Assessments" value="3" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
					</TabList>
				</Box>

				{currentUser.role !== 'student' && (
					<TabPanel value="1">
						{isNotesLoading ? (
							<p>Loading Lecture Notes...</p>
						) : isNotesError ? (
							<p>Error loading lecture notes.</p>
						) : (
							<CreateAssesments lectureNotes={lectureNotes} deleteCreatedAssesment={deleteCreatedAssesment} />
						)}
					</TabPanel>
				)}

				<TabPanel value="2">
					{isLiveLoading ? (
						<p>Loading Live Assessments...</p>
					) : isLiveError ? (
						<p>Error loading live assessments.</p>
					) : (
						<LiveAssesments liveAssesments={liveAssesments} updateLiveAssessment={refetchLive} currentUser={currentUser} />
					)}
				</TabPanel>

				<TabPanel value="3">
					{isPastLoading ? (
						<p>Loading Past Assessments...</p>
					) : isPastError ? (
						<p>Error loading past assessments.</p>
					) : (
						<PastAssesments pastAssesments={pastAssesments} />
					)}
				</TabPanel>
			</TabContext>
		</Box>
	);
};


const AssesmentsPage = () => (
	<QueryClientProvider client={queryClient}>
		<AssesmentsInner />
	</QueryClientProvider>
);

export default AssesmentsPage;
