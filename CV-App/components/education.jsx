import { useEffect, useRef, useState } from 'react';
import CVEditButton from './edit.jsx';

export default function EducationSection({ submitSignal = 0 }) {
    const [isEditing, setIsEditing] = useState(true);
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        startDate: '',
        endDate: ''
    });
    const [submittedData, setSubmittedData] = useState(null);
    const lastSubmitSignal = useRef(submitSignal);

    useEffect(() => {
        if (submitSignal === lastSubmitSignal.current) return;
        lastSubmitSignal.current = submitSignal;
        setSubmittedData(formData);
        setIsEditing(false);
    }, [formData, submitSignal]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <section>
            <h2>Educational Background</h2>

            {isEditing ? (
                <>
                    <label>
                        School: <input type="text" name="school" value={formData.school} onChange={handleChange} placeholder="Enter your school name" />
                    </label>
                    <label>
                        Degree/Field: <input type="text" name="degree" value={formData.degree} onChange={handleChange} placeholder="Enter your degree" />
                    </label>
                    <label>Study Period:</label>
                    <label>
                        Start Date:
                        <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                    </label>
                    <label>
                        End Date:
                        <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                    </label>
                </>
            ) : (
                <>
                    <p><strong>School:</strong> {submittedData?.school || 'N/A'}</p>
                    <p><strong>Degree/Field:</strong> {submittedData?.degree || 'N/A'}</p>
                    <p><strong>Study Period:</strong> {submittedData?.startDate || 'N/A'} to {submittedData?.endDate || 'N/A'}</p>
                    <CVEditButton onEdit={handleEdit} />
                </>
            )}
        </section>
    );
}