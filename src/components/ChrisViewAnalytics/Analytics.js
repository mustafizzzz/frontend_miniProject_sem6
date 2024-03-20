import React, { useContext } from "react";
import { useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";
import "./Analytics.css";
import StudentDetailsPage from "./Overall_Data";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { emotionsContext } from "../../ContextApi/emotionsContext";

const Analytics = () => {
  // const navigate = useNavigate();
  const { textEmotions, videoEmotions, audioEmotions, overAllEmotions, studentLiveEmotions } = useContext(emotionsContext);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const studentData = [
    {
      name: "John Doe",
      emotionOverall: "Happy",
      emotionAudio: "Happy",
      emotionText: "Excited",
      emotionVideo: "Calm",
    },
    {
      name: "Chris Dias",
      emotionOverall: "Happy",
      emotionAudio: "Sad",
      emotionText: "Confused",
      emotionVideo: "Surprised",
    },
    {
      name: "Sam Altman",
      emotionOverall: "Happy",
      emotionAudio: "Confused",
      emotionText: "Happy",
      emotionVideo: "Bored",
    },
    {
      name: "Joy Dias",
      emotionOverall: "Happy",
      emotionAudio: "Confused",
      emotionText: "Happy",
      emotionVideo: "Bored",
    },
  ];

  const handleChartClick = () => {
    // Your existing code...

    // Set selected student data when a chart is clicked
    // For demonstration purposes, setting the first student's data
    setSelectedStudent(studentData[0]);
  };






  //video carts functions handle
  const defaultVideoEmotions = {
    happy: 1,
    surprised: 1,
    confused: 1,
    bored: 1,
    pnf: 1
  };
  const videoLabels = videoEmotions ? Object.keys(videoEmotions) : Object.keys(defaultVideoEmotions);
  const videoData = videoEmotions ? Object.values(videoEmotions) : Object.values(defaultVideoEmotions);
  const videochart = {
    labels: videoLabels,
    datasets: [
      {
        label: "Analytics Data",
        data: videoData,
        backgroundColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],

        borderWidth: 1,
      },
    ],
  };

  //audio carts functions handle
  const defaultAudioEmotions = {
    happy: 1,
    surprised: 1,
    confused: 1,
    bored: 1,
    pnf: 1
  };
  const audioLabels = audioEmotions ? Object.keys(audioEmotions) : Object.keys(defaultAudioEmotions);
  const audioData = audioEmotions ? Object.values(audioEmotions) : Object.values(defaultAudioEmotions);
  const audiochart = {
    labels: audioLabels,
    datasets: [
      {
        label: "Analytics Data",
        data: audioData,
        backgroundColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  //message carts functions handle
  const defaultTextEmotions = {
    happy: 1,
    surprised: 1,
    confused: 1,
    bored: 1,
    pnf: 1
  };
  const textLabels = textEmotions ? Object.keys(textEmotions) : Object.keys(defaultTextEmotions);
  const textData = textEmotions ? Object.values(textEmotions) : Object.values(defaultTextEmotions);
  const textchart = {
    labels: textLabels,
    datasets: [
      {
        label: "Analytics Data",
        data: textData,
        backgroundColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  //overall carts functions handle
  const defaultOverAllEmotions = {
    happy: 1,
    surprised: 1,
    confused: 1,
    bored: 1,
    absent: 1
  };
  const overAllLabels = overAllEmotions ? Object.keys(overAllEmotions) : Object.keys(defaultOverAllEmotions);
  const overAllData = overAllEmotions ? Object.values(overAllEmotions) : Object.values(defaultOverAllEmotions);
  const overAllBarChart = {
    labels: overAllLabels,
    datasets: [
      {
        label: "Analytics Data",
        data: overAllData,
        backgroundColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderColor: [
          "rgba(56, 142, 60, 255)",
          "rgba(25,118,210,255)",
          "rgba(211,47,47,255)",
          "rgba(251,192,45,255)",
          "rgba(3,169,244,255)",
        ],
        borderWidth: 1,
      },
    ],
  };


  //chart options for all charts
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Display legend
        position: 'top', // Legend position
      },
    },
  };
  //chart options for bar charts 
  const chartOptionBarChart = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 0, // Set the minimum value of the y-axis scale to 1
        max: 'auto', // Automatically determine the maximum value based on the data
        ticks: {
          stepSize: 1, // Set the step size to 1 to display only integers
        },
      },

    },
  };



  return (
    <div className="container-fluid in-call-charts">


      <div className="row over-all-bar justify-content-center mb-5 border py-3 mx-md-4">
        <div className="col-12 col-md-10">
          <h2 className="text-center mb-3">Over all charts</h2>
          <Bar data={overAllBarChart} options={chartOptionBarChart} />
        </div>
      </div>

      <div className="row  two-pie justify-content-evenly mb-5 py-3">
        <div className="col-10 col-md-5 pie-audio py-3 border" >
          <h3 className="text-center">Audio Chart</h3>
          <Pie data={audiochart} options={chartOptions} />
        </div>

        <div className="col-10 col-md-5 py-3 pie-video border">
          <h3 className="text-center">Video Chart</h3>
          <Pie data={videochart} options={chartOptions} />
        </div>
      </div>

      <div className="row one-pie justify-content-center mb-5 py-3">
        <div className="col-10 col-md-5 pi-messages py-3 border">
          <h3 className="text-center">In call message chart</h3>
          <Pie data={textchart} options={chartOptions} />
        </div>
      </div>

      <div className="row accordion-each border p-3">

        <div className="accordion-heading">
          <h3 className="ms-2 text-start mb-3">Emotions of each student</h3>
        </div>


        <div className="accordion-box">

          {/* <Accordion className="my-3" >
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >


              <Typography sx={{ width: '65%', flexShrink: 0, fontWeight: "bold" }}>
                Chris Dias
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Happy</Typography>

            </AccordionSummary>

            <AccordionDetails>
              <div className="emotion-details d-flex flex-column">

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Text:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
                  </div>
                </div>

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Audio:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">30%</div>
                  </div>
                </div>

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Video:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">70%</div>
                  </div>
                </div>

              </div>

            </AccordionDetails>

          </Accordion>

          <Accordion className="my-3" >
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >


              <Typography sx={{ width: '65%', flexShrink: 0, fontWeight: "bold" }}>
                Chris Dias
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Happy</Typography>

            </AccordionSummary>

            <AccordionDetails>
              <div className="emotion-details d-flex flex-column">

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Text:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
                  </div>
                </div>

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Audio:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">30%</div>
                  </div>
                </div>

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Video:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">70%</div>
                  </div>
                </div>

              </div>

            </AccordionDetails>

          </Accordion>

          <Accordion className="my-3" >
            <AccordionSummary
              expandIcon={<ArrowDownwardIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >


              <Typography sx={{ width: '65%', flexShrink: 0, fontWeight: "bold" }}>
                Chris Dias
              </Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>Happy</Typography>

            </AccordionSummary>

            <AccordionDetails>
              <div className="emotion-details d-flex flex-column">

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Text:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: '50%' }} aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">50%</div>
                  </div>
                </div>

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Audio:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-info" role="progressbar" style={{ width: '30%' }} aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">30%</div>
                  </div>
                </div>

                <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                  <Typography variant="body1" className="fw-bold">Video:</Typography>
                  <div className="progress w-75">
                    <div className="progress-bar bg-success" role="progressbar" style={{ width: '70%' }} aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">70%</div>
                  </div>
                </div>

              </div>

            </AccordionDetails>

          </Accordion> */}

          {studentLiveEmotions ? studentLiveEmotions?.map((student, index) => (
            <Accordion key={index} className="my-3">
              <AccordionSummary
                expandIcon={<ArrowDownwardIcon />}
                aria-controls={`panel${index + 1}-content`}
                id={`panel${index + 1}-header`}
              >
                <Typography sx={{ width: '65%', flexShrink: 0, fontWeight: "bold" }}>
                  {student.username}
                </Typography>
                <Typography sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                  {student.overall_emotion}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <div className="emotion-details d-flex flex-column">
                  <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                    <Typography variant="body1" className="fw-bold">Text:</Typography>
                    <div className="progress w-75">
                      <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${student.text_emotion * 10}%` }} aria-valuenow={student.text_emotion} aria-valuemin="0" aria-valuemax="100">
                        {student.text_emotion}%
                      </div>
                    </div>
                  </div>
                  <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                    <Typography variant="body1" className="fw-bold">Audio:</Typography>
                    <div className="progress w-75">
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: `${student.audio_emotion * 10}%` }} aria-valuenow={student.audio_emotion} aria-valuemin="0" aria-valuemax="100">
                        {student.audio_emotion}%
                      </div>
                    </div>
                  </div>
                  <div className="emotion-detail d-flex align-items-center justify-content-evenly my-2">
                    <Typography variant="body1" className="fw-bold">Video:</Typography>
                    <div className="progress w-75">
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: `${student.video_emotion * 10}%` }} aria-valuenow={student.video_emotion} aria-valuemin="0" aria-valuemax="100">
                        {student.video_emotion}%
                      </div>
                    </div>
                  </div>
                </div>
              </AccordionDetails>
            </Accordion>
          )) : <h2>No student joined</h2>}

        </div>

      </div>

    </div >
  );
};

export default Analytics;


//commeted code
{/* <h1>Analytics of each emotion</h1> */ }
{/* <div className="analytics-container">

        <div className="overall-target ">
          <h3>Overall Chart</h3>
          <Bar
            data={overallData}
            options={chartOptions}
            onClick={handleChartClick}
          />
        </div>


        <div className="video-target">
          <h3>Video Chart</h3>
          <Pie
            data={videochart}
            options={chartOptions}
            onClick={handleChartClick}
          />
        </div>


        <div className="chart-row reduced-size">
          <div className="audio-target">
            <h3>Audio Chart</h3>
            <Pie
              data={audiochart}
              options={chartOptions}
              onClick={handleChartClick}
            />
          </div>

          <div className="text-target">
            <h3>Text Chart</h3>
            <Pie
              data={textchart}
              options={chartOptions}
              onClick={handleChartClick}
            />
          </div>

        </div>
      </div> */}

{/* <div className="overall-data">
        <StudentDetailsPage />
      </div> */}
