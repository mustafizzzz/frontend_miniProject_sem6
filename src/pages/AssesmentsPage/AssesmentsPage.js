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

const AssesmentsPage = () => {

	const [value, setValue] = useState('1'); // Track selected tab value as string

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};



	return (

		<Box sx={{ width: '100%' }}>
			<TabContext value={value}>

				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList onChange={handleChange} aria-label="assessment tabs" centered className='assesments-tabs'>
						<Tab label="Lecture Schedule" value="1" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
						<Tab label="Live Assessments" value="2" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
						<Tab label="Past Assessments" value="3" sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: '1rem' }} />
					</TabList>
				</Box>

				{/* Lecture Schedule Tab Panel */}
				<TabPanel value="1">
					<CreateAssesments />
				</TabPanel>

				{/* Live Assessments Tab Panel */}
				<TabPanel value="2">
					<LiveAssesments />
				</TabPanel>

				{/* Past Assessments Tab Panel */}
				<TabPanel value="3">
					<PastAssesments />
				</TabPanel>

			</TabContext>

		</Box>

	);
};

export default AssesmentsPage;
