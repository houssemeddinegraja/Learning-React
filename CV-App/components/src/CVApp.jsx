import { useState } from 'react';
import Header from '../components/header.jsx';
import GeneralInfoSection from '../components/general.jsx';
import EducationSection from '../components/education.jsx';
import PracticalExperienceSection from '../components/practical.jsx';
import CVSubmitButton from '../components/submit.jsx';
import '../styles/CVApp.css';

export default function CVApp() {
  const [submitSignal, setSubmitSignal] = useState(0);

  return (
    <div className="cv-app">
      <Header />
      <GeneralInfoSection submitSignal={submitSignal} />
      <EducationSection submitSignal={submitSignal} />
      <PracticalExperienceSection submitSignal={submitSignal} />
      <div className="cv-submit">
        <CVSubmitButton onSubmit={() => setSubmitSignal((signal) => signal + 1)} />
      </div>
    </div>
  );
}