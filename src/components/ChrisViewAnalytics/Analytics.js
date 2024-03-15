import React from "react";
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
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const Analytics = () => {
  // const navigate = useNavigate();

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

  const audiochart = {
    labels: ["Happy", "Surprised", "Confused", "Bored", "Absent"],
    datasets: [
      {
        label: "Analytics Data",
        data: [1, 1, 0, 0, 0],
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

  const textchart = {
    labels: ["Happy", "Surprised", "Confused", "Bored", "Absent"],
    datasets: [
      {
        label: "Analytics Data",
        data: [2, 0, 1, 0, 0],
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

  const videochart = {
    labels: ["Happy", "Surprised", "Confused", "Bored", "Absent"],
    datasets: [
      {
        label: "Analytics Data",
        data: [12, 1, 0, 2, 5],
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

  const overallData = {
    labels: ["Happy", "Surprised", "Confused", "Bored", "Absent"],
    datasets: [
      {
        label: "Analytics Data",
        data: [10, 20, 20, 25, 45],
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

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Display legend
        position: 'top', // Legend position
      },
    },
  };

  return (
    <div className="container-fluid in-call-charts">


      <div className="row over-all-bar justify-content-center mb-5">
        <div className="col-12 col-md-10">
          <h3 className="text-center">Over all chart</h3>
          <Bar data={overallData} options={chartOptions} />
        </div>
      </div>

      <div className="row  two-pie justify-content-evenly mb-5">
        <div className="col-10 col-md-4" >
          <h3 className="text-center">Audio Chart</h3>
          <Pie data={audiochart} options={chartOptions} />
        </div>

        <div className="col-10 col-md-4">
          <h3 className="text-center">Video Chart</h3>
          <Pie data={videochart} options={chartOptions} />
        </div>
      </div>

      <div className="row one-pie justify-content-center mb-5">
        <div className="col-10 col-md-4">
          <h3 className="text-center">In call message chart</h3>
          <Pie data={audiochart} options={chartOptions} />
        </div>
      </div>

      <div className="row accordion-each">
        <div className="accordion-heading">
          <h3 className="ms-2 text-start mb-3">Emotions of each student</h3>
        </div>

        {/* <div className="accordion" id="accordionExample">

          <div className="accordion-item my-3">
            <h2 className="accordion-header" id="headingOne">
              <button className="accordion-button fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                Chris Dias
                <p className="ms-auto text-start m-0 text-muted fw-bold ps-3"> See the emotion for each student</p>
              </button>

            </h2>
            <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <strong>This is the first item's accordion body.</strong> It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>


          <div className="accordion-item my-3">
            <h2 className="accordion-header" id="headingTwo">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                Accordion Item #2
              </button>
            </h2>
            <div id="collapseTwo" className="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
              <div className="accordion-body">
                <strong>This is the second item's accordion body.</strong> It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.
              </div>
            </div>
          </div>




        </div> */}

        <div className="accordio-box">

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
