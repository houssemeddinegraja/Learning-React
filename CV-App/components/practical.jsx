import { useEffect, useRef, useState } from 'react';
import CVEditButton from './edit.jsx';

export default function PracticalExperienceSection({ submitSignal = 0 }) {
    const [isEditing, setIsEditing] = useState(true);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        responsibilities: '',
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
            <h2>Practical Experience</h2>

            {isEditing ? (
                <>
                    <label>
                        Company: <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Enter company name" />
                    </label>
                    <label>
                        Position: <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Enter your position" />
                    </label>
                    <label>
                        Responsibilities: <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} placeholder="Enter your responsibilities" />
                    </label>
                    <label>Duration:</label>
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
                    <p><strong>Company:</strong> {submittedData?.company || 'N/A'}</p>
                    <p><strong>Position:</strong> {submittedData?.position || 'N/A'}</p>
                    <p><strong>Responsibilities:</strong> {submittedData?.responsibilities || 'N/A'}</p>
                    <p><strong>Duration:</strong> {submittedData?.startDate || 'N/A'} to {submittedData?.endDate || 'N/A'}</p>
                    <CVEditButton onEdit={handleEdit} />
                </>
            )}
        </section>
    );
}