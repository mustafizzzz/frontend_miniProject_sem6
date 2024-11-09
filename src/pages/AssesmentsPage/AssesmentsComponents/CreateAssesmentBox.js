import React, { useContext, useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Backdrop, CircularProgress } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../ContextApi/userContex';
import { DatePicker, DesktopDatePicker, DesktopTimePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { REACT_APP_DEPLOY } from '../../../config';
import { set } from 'firebase/database';


const CreateAssesmentBox = ({ open, onClose, selectedLecture, handelDeleteAssesment }) => {

	const today = dayjs();
	const todayStartOfTheDay = today.startOf('day');

	const { currentUser } = useContext(UserContext)
	const [testName, setTestName] = useState('');
	const [startDate, setStartDate] = useState(today);
	const [startTime, setStartTime] = useState(todayStartOfTheDay);
	const [endDate, setEndDate] = useState(today);
	const [endTime, setEndTime] = useState(todayStartOfTheDay);
	const [maxDuration, setMaxDuration] = useState('');
	const [maxMarks, setMaxMarks] = useState('');
	//backdrop for loading
	const [backdropOpen, setBackdropOpen] = useState(false)
	const navigate = useNavigate();

	useEffect(() => {
		if (selectedLecture) {
			setTestName(`${selectedLecture.lectureTitle}-Assesment-Test`);
		}
	}, [selectedLecture])


	const formatDateTime = (date, time) => {
		if (!date || !time) return null;

		// Combine date and time
		const combinedDateTime = dayjs(date)
			.hour(time.hour())
			.minute(time.minute())
			.second(0)
			.millisecond(0);

		// Format to required string
		return combinedDateTime.format('YYYY-MM-DDTHH:mm:ss.SSS');
	};



	const handleProceed = async () => {


		try {
			setBackdropOpen(true);
			const formattedStartDateTime = formatDateTime(startDate, startTime);
			const formattedEndDateTime = formatDateTime(endDate, endTime);
			console.log('formatted start date:', formattedStartDateTime);

			const formatData = {
				lectureId: selectedLecture.lectureId,
				createdBy: currentUser.hostId,
				testName: testName,
				context: {
					lectureNotes: selectedLecture.note_id,
					externalDocuments: [],
				},
				startDateAndTime: formattedStartDateTime,
				endDateAndTime: formattedEndDateTime,
				maxDuration: maxDuration,
				maxMarks: maxMarks,

			}

			const response = await axios.post(`${REACT_APP_DEPLOY}/api/v1/test/create_test`, formatData);
			console.log('response:', response);
			setBackdropOpen(false);
			handelDeleteAssesment(selectedLecture.lectureId);
			onClose();
		} catch (error) {
			setBackdropOpen(false);
			console.log(error);
		} finally {
			setBackdropOpen(false);
		}


	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" className="join-instant-meet-box" PaperProps={{ style: { borderRadius: '1rem' } }}>
			<DialogTitle className="text-dark fw-bold fs-3">Schedule Test</DialogTitle>

			<DialogContent dividers>

				<div className="form-group mb-3">
					<label htmlFor="testName">Test Name</label>
					<input
						type="text"
						className="form-control"
						id="testName"
						value={testName}
						onChange={(e) => setTestName(e.target.value)}
						placeholder="Enter test name"
					/>
				</div>

				<LocalizationProvider dateAdapter={AdapterDayjs}>

					<div className="row mb-3">
						<div className="col-12 mb-2">
							<label>Start Date and Time</label>
						</div>
						<div className="col-md-12 d-flex gap-3">

							<div className="w-50">
								<DatePicker
									defaultValue={today}
									disablePast
									views={['year', 'month', 'day']}
									onChange={(date) => setStartDate(date)}
									sx={{
										'& .MuiInputBase-root': {
											borderRadius: '1rem',
											padding: '0.5rem',
										},
										'& .MuiOutlinedInput-input': {
											padding: '0.25rem',
										},
										width: '100%'
									}}
								/>
							</div>

							<div className="w-50">
								<TimePicker
									defaultValue={todayStartOfTheDay}

									value={todayStartOfTheDay}
									onChange={(time) => setStartTime(time)}
									sx={{
										'& .MuiInputBase-root': {
											borderRadius: '1rem',
											padding: '0.5rem',
										},
										'& .MuiOutlinedInput-input': {
											padding: '0.25rem',
										},
										width: '100%'
									}}
								/>
							</div>

						</div>
					</div>


					<div className="row mb-3">
						<div className="col-12 mb-2">
							<label>End Date and Time</label>
						</div>

						<div className="col-md-12 d-flex gap-3">
							<div className="w-50">
								<DatePicker
									defaultValue={today}
									disablePast
									views={['year', 'month', 'day']}
									onChange={(date) => setEndDate(date)}
									sx={{
										'& .MuiInputBase-root': {
											borderRadius: '1rem',
											padding: '0.5rem',
										},
										'& .MuiOutlinedInput-input': {
											padding: '0.25rem',
										},
										width: '100%'
									}}
								/>
							</div>

							<div className="w-50">
								<TimePicker defaultValue={todayStartOfTheDay}
									value={todayStartOfTheDay}
									onChange={(time) => setEndTime(time)}
									sx={{
										'& .MuiInputBase-root': {
											borderRadius: '1rem',
											padding: '0.5rem',
										},
										'& .MuiOutlinedInput-input': {
											padding: '0.25rem',
										},
										width: '100%'
									}} />
							</div>

						</div>

					</div>

				</LocalizationProvider>

				<div className="form-group mb-3">
					<label htmlFor="maxDuration">Max Duration (minutes)</label>
					<input
						type="number"
						className="form-control"
						id="maxDuration"
						value={maxDuration}
						onChange={(e) => setMaxDuration(e.target.value)}
						placeholder="Enter max duration"
					/>
				</div>

				<div className="form-group mb-3">
					<label htmlFor="maxMarks">Max Marks</label>
					<input
						type="number"
						className="form-control"
						id="maxMarks"
						value={maxMarks}
						onChange={(e) => setMaxMarks(e.target.value)}
						placeholder="Enter max marks"
					/>
				</div>

			</DialogContent>

			<DialogActions className="p-3 create-instant-meet-buttons">
				<button className="btn btn-outline-secondary" onClick={onClose}>
					Cancel
				</button>
				<button className="btn btn-primary" onClick={handleProceed}>
					Proceed
				</button>
			</DialogActions>

			<Backdrop
				sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
				open={backdropOpen}
			>
				<CircularProgress color="inherit" />
				<p className="m-0 p-0 fs-4 mx-2">Creating Assesment, please wait...</p>
			</Backdrop>

		</Dialog >
	)
}

export default CreateAssesmentBox