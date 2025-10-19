import React, { useState, useCallback } from "react";
import { Button, Input, Select } from "../UI";
import { useResumeContext } from "../../contexts/ResumeContext";
import { Certification } from "../../types/resume.types";

export interface CertificationsEditorProps {
    className?: string;
}

export interface CertificationEntryProps {
    certification: Certification;
    isEditing: boolean;
    onUpdate: (id: string, updates: Partial<Certification>) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
    onToggleEdit: (id: string) => void;
    onMoveUp: (id: string) => void;
    onMoveDown: (id: string) => void;
}

const MONTH_OPTIONS = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
];

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear + 10; year >= 1990; year--) {
        years.push({ value: year.toString(), label: year.toString() });
    }
    return years;
};

const YEAR_OPTIONS = generateYearOptions();

const CERTIFICATION_SUGGESTIONS = [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional",
    "Microsoft Azure Administrator",
    "Certified Kubernetes Administrator (CKA)",
    "Certified Information Systems Security Professional (CISSP)",
    "CompTIA Security+",
    "Oracle Certified Professional",
    "Certified ScrumMaster (CSM)",
];

const CertificationEntry: React.FC<CertificationEntryProps> = ({
    certification,
    isEditing,
    onUpdate,
    onDelete,
    onDuplicate,
    onToggleEdit,
    onMoveUp,
    onMoveDown,
}) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [doesNotExpire, setDoesNotExpire] = useState(!certification.expiryDate);

    const handleFieldUpdate = (field: keyof Certification, value: any) => {
        onUpdate(certification.id, { [field]: value });
    };

    const handleDateUpdate = (field: "issueDate" | "expiryDate", month: string, year: string) => {
        if (month && year) {
            handleFieldUpdate(field, `${year}-${month}`);
        }
    };

    const parseDate = (dateString: string) => {
        if (!dateString) return { month: "", year: "" };
        const [year, month] = dateString.split("-");
        return { month: month || "", year: year || "" };
    };

    const issueDate = parseDate(certification.issueDate);
    const expiryDate = parseDate(certification.expiryDate || "");

    const handleDoesNotExpireToggle = (checked: boolean) => {
        setDoesNotExpire(checked);
        if (checked) {
            handleFieldUpdate("expiryDate", "");
        }
    };

    const validateURL = (url: string): boolean => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isExpiringSoon = () => {
        if (!certification.expiryDate) return false;
        const expiry = new Date(certification.expiryDate + "-01");
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        return expiry <= threeMonthsFromNow && expiry >= new Date();
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                            {certification.name || "New Certification"}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {certification.issuer && certification.issuer}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    {isExpiringSoon() && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                            ⚠ Expiring Soon
                        </span>
                    )}
                    <button type="button" onClick={() => onMoveUp(certification.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Move up">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                    </button>
                    <button type="button" onClick={() => onMoveDown(certification.id)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md" title="Move down">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    <Button variant="ghost" size="sm" onClick={() => onToggleEdit(certification.id)}>
                        {isEditing ? "Save" : "Edit"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDuplicate(certification.id)} title="Duplicate entry">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:text-red-700 hover:bg-red-50" title="Delete entry">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </Button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Certification</h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this certification? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
                            <Button variant="danger" onClick={() => { onDelete(certification.id); setShowDeleteConfirm(false); }}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}

            {isEditing && (
                <div className="space-y-4 border-t border-gray-200 pt-4">
                    <div>
                        <Input label="Certification Name" value={certification.name} onChange={(e) => handleFieldUpdate("name", e.target.value)} required placeholder="e.g., AWS Certified Solutions Architect" list="cert-suggestions" />
                        <datalist id="cert-suggestions">
                            {CERTIFICATION_SUGGESTIONS.map((cert, index) => (
                                <option key={index} value={cert} />
                            ))}
                        </datalist>
                    </div>

                    <Input label="Issuing Organization" value={certification.issuer} onChange={(e) => handleFieldUpdate("issuer", e.target.value)} required placeholder="e.g., Amazon Web Services" />

                    <div className="space-y-4">
                        <h5 className="text-sm font-medium text-gray-700">Issue Date</h5>
                        <div className="grid grid-cols-2 gap-4">
                            <Select label="Month" options={MONTH_OPTIONS} value={issueDate.month} onChange={(value) => handleDateUpdate("issueDate", value, issueDate.year)} placeholder="Month" />
                            <Select label="Year" options={YEAR_OPTIONS} value={issueDate.year} onChange={(value) => handleDateUpdate("issueDate", issueDate.month, value)} placeholder="Year" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h5 className="text-sm font-medium text-gray-700">Expiration Date</h5>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" checked={doesNotExpire} onChange={(e) => handleDoesNotExpireToggle(e.target.checked)} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                <span className="text-sm text-gray-700">Does not expire</span>
                            </label>
                        </div>
                        {!doesNotExpire && (
                            <div className="grid grid-cols-2 gap-4">
                                <Select label="Month" options={MONTH_OPTIONS} value={expiryDate.month} onChange={(value) => handleDateUpdate("expiryDate", value, expiryDate.year)} placeholder="Month" />
                                <Select label="Year" options={YEAR_OPTIONS} value={expiryDate.year} onChange={(value) => handleDateUpdate("expiryDate", expiryDate.month, value)} placeholder="Year" />
                            </div>
                        )}
                    </div>

                    <Input label="Credential ID (Optional)" value={certification.credentialId || ""} onChange={(e) => handleFieldUpdate("credentialId", e.target.value)} placeholder="e.g., ABC123XYZ" />

                    <div>
                        <Input label="Credential URL (Optional)" value={certification.url || ""} onChange={(e) => handleFieldUpdate("url", e.target.value)} placeholder="https://..." type="url" />
                        {certification.url && !validateURL(certification.url) && (
                            <p className="text-sm text-red-600 mt-1">Please enter a valid URL</p>
                        )}
                    </div>
                </div>
            )}

            {!isEditing && (
                <div className="space-y-3 border-t border-gray-200 pt-4">
                    {certification.credentialId && (
                        <p className="text-sm text-gray-600">
                            <span className="font-medium">Credential ID:</span> {certification.credentialId}
                        </p>
                    )}
                    {certification.url && (
                        <a href={certification.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center">
                            View Credential
                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    )}
                    <div className="text-xs text-gray-500">
                        {certification.issueDate && (
                            <>
                                Issued: {new Date(certification.issueDate + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                                {certification.expiryDate && (
                                    <> • Expires: {new Date(certification.expiryDate + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}</>
                                )}
                                {!certification.expiryDate && <> • No Expiration</>}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const CertificationsEditor: React.FC<CertificationsEditorProps> = ({ className = "" }) => {
    const { resume, dispatch } = useResumeContext();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [editingEntryId, setEditingEntryId] = useState<string | null>(null);

    const certificationsSection = (resume.sections || []).find((section) => section.type === "certifications");
    const certifications = certificationsSection?.content ? (certificationsSection.content as { certifications: Certification[] }).certifications : [];

    const generateId = (): string => Math.random().toString(36).substr(2, 9);

    const debouncedUpdate = useCallback(
        (() => {
            let timeoutId: ReturnType<typeof setTimeout>;
            return (updatedCertifications: Certification[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (certificationsSection) {
                        dispatch({
                            type: "UPDATE_SECTION",
                            payload: {
                                id: certificationsSection.id,
                                updates: { content: { certifications: updatedCertifications } },
                            },
                        });
                    }
                }, 300);
            };
        })(),
        [dispatch, certificationsSection]
    );

    const addCertification = () => {
        const newCertification: Certification = {
            id: generateId(),
            name: "",
            issuer: "",
            issueDate: "",
            expiryDate: "",
            credentialId: "",
            url: "",
        };
        const updated = [...certifications, newCertification];
        debouncedUpdate(updated);
        setEditingEntryId(newCertification.id);
    };

    const updateCertification = (id: string, updates: Partial<Certification>) => {
        const updated = certifications.map((cert) => (cert.id === id ? { ...cert, ...updates } : cert));
        debouncedUpdate(updated);
    };

    const deleteCertification = (id: string) => {
        const updated = certifications.filter((cert) => cert.id !== id);
        debouncedUpdate(updated);
        if (editingEntryId === id) setEditingEntryId(null);
    };

    const duplicateCertification = (id: string) => {
        const certToDuplicate = certifications.find((cert) => cert.id === id);
        if (certToDuplicate) {
            const duplicated: Certification = { ...certToDuplicate, id: generateId(), name: `${certToDuplicate.name} (Copy)` };
            const updated = [...certifications, duplicated];
            debouncedUpdate(updated);
            setEditingEntryId(duplicated.id);
        }
    };

    const toggleEditEntry = (id: string) => setEditingEntryId(editingEntryId === id ? null : id);

    const moveCertificationUp = (id: string) => {
        const currentIndex = certifications.findIndex((cert) => cert.id === id);
        if (currentIndex > 0) {
            const updated = [...certifications];
            [updated[currentIndex - 1], updated[currentIndex]] = [updated[currentIndex], updated[currentIndex - 1]];
            debouncedUpdate(updated);
        }
    };

    const moveCertificationDown = (id: string) => {
        const currentIndex = certifications.findIndex((cert) => cert.id === id);
        if (currentIndex < certifications.length - 1) {
            const updated = [...certifications];
            [updated[currentIndex], updated[currentIndex + 1]] = [updated[currentIndex + 1], updated[currentIndex]];
            debouncedUpdate(updated);
        }
    };

    if (!certificationsSection) return null;

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${className}`}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50" onClick={() => setIsCollapsed(!isCollapsed)}>
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
                        <p className="text-sm text-gray-500">{certifications.length} {certifications.length === 1 ? "entry" : "entries"}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <Button variant="primary" size="sm" onClick={(e) => { e.stopPropagation(); addCertification(); }} leftIcon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}>
                        Add Certification
                    </Button>
                    <button type="button" className="p-2 text-gray-400 hover:text-gray-600" onClick={(e) => { e.stopPropagation(); setIsCollapsed(!isCollapsed); }}>
                        <svg className={`w-5 h-5 transition-transform duration-200 ${isCollapsed ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                </div>
            </div>

            {!isCollapsed && (
                <div className="p-4 space-y-4">
                    {certifications.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                            <p className="text-lg font-medium mb-2">No certifications yet</p>
                            <p className="text-sm mb-4">Add your professional certifications to stand out</p>
                            <Button variant="primary" onClick={addCertification}>Add Your First Certification</Button>
                        </div>
                    ) : (
                        certifications.map((cert) => (
                            <CertificationEntry key={cert.id} certification={cert} isEditing={editingEntryId === cert.id} onUpdate={updateCertification} onDelete={deleteCertification} onDuplicate={duplicateCertification} onToggleEdit={toggleEditEntry} onMoveUp={moveCertificationUp} onMoveDown={moveCertificationDown} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
