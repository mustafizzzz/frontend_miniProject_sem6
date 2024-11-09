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

const AssesmentsPage = () => {
	const { currentUser } = useContext(UserContext);

	const [notes, setNotes] = useState([]);
	const [liveAssesments, setLiveAssesments] = useState([]);
	const [pastAssesments, setPastAssesments] = useState([]);
	// console.log(REACT_APP_DEPLOY, currentUser);


	useEffect(() => {

		const fetchNotes = async () => {
			try {
				const lectureList = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/fetch_lecture_with_notes`, {
					host_id: currentUser.hostId
				});
				setNotes(lectureList.data);

				const liveAssesmentsList = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/view_live_tests`, {
					createdBy: currentUser.hostId
				});
				setLiveAssesments(liveAssesmentsList.data);


				const pastAssesmentsList = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/view_past_tests`, {
					createdBy: currentUser.hostId
				});
				setPastAssesments(pastAssesmentsList.data);

				console.log('lecture notes:', lectureList, 'liveAssesmentsList', liveAssesmentsList.data, 'pastAssesmentsList', pastAssesmentsList.data);




			} catch (error) {
				console.log(error);

			}
		};

		fetchNotes();

	}, []);

	const [value, setValue] = useState('1'); // Track selected tab value as string

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const updateLiveAssessment = (liveAssesmentsList) => {
		setLiveAssesments(liveAssesmentsList);
	}

	const deleteCreatedAssesment = (lectureId) => {
		const updatedLectures = notes.filter(lecture => lecture.lectureId !== lectureId);
		setNotes(updatedLectures);
	}



	return (

		<Box sx={{ width: '100%' }} >
			<TabContext value={value}>

				<Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'white', borderRadius: '1rem' }}>
					<TabList onChange={handleChange} aria-label="assessment tabs" centered className='assesments-tabs'>
						<Tab label="Create Assesments" value="1" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
						<Tab label="Live Assessments" value="2" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
						<Tab label="Past Assessments" value="3" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
					</TabList>
				</Box>

				{/* Lecture Schedule Tab Panel */}
				<TabPanel value="1">
					<CreateAssesments lectureNotes={notes} deleteCreatedAssesment={deleteCreatedAssesment} />
				</TabPanel>

				{/* Live Assessments Tab Panel */}
				<TabPanel value="2">
					<LiveAssesments liveAssesments={liveAssesments} updateLiveAssessment={updateLiveAssessment} currentUser={currentUser} />
				</TabPanel>

				{/* Past Assessments Tab Panel */}
				<TabPanel value="3">
					<PastAssesments pastAssesments={pastAssesments} />
				</TabPanel>

			</TabContext>

		</Box>

	);
};

export default AssesmentsPage;
