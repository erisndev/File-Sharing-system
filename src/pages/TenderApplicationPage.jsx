// src/pages/TenderApplicationPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { tenderAPI, applicationAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDropzone } from "react-dropzone";
import {
  Loader2,
  FileText,
  Building,
  User,
  Mail,
  Phone,
  DollarSign,
  Clock,
  Upload,
  CheckCircle,
} from "lucide-react";

const TenderApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [bidderName, setBidderName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [bbeeLevel, setBbeeLevel] = useState("");
  const [cidbGrading, setCidbGrading] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchTender = async () => {
      try {
        const res = await tenderAPI.getById(id);
        setTender(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTender();
  }, [id]);

  // Drag-and-drop file upload
  const handleDrop = (acceptedFiles) => {
    const filteredFiles = acceptedFiles.filter(
      (file) => file.size <= 10 * 1024 * 1024
    );
    if (filteredFiles.length < acceptedFiles.length) {
      alert("Some files were too large and were not added (max 10MB each).");
    }
    setDocuments((prev) => [...prev, ...filteredFiles]);
  };

  const DropzoneArea = () => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop: handleDrop,
      accept: {
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
        "image/jpeg": [".jpeg", ".jpg"],
        "image/png": [".png"],
      },
      maxFiles: 10,
    });

    return (
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">
          Drag & drop your documents here, or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF, DOC, DOCX, JPG, PNG up to 10MB each
        </p>
        {documents.length > 0 && (
          <ul className="text-sm text-gray-700 mt-3">
            {documents.map((file, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  {file.name}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setDocuments((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="!text-red-500 hover:!text-red-700 text-xs !bg-transparent"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append("bidderName", bidderName);
      formData.append("registrationNumber", registrationNumber);
      formData.append("bbeeLevel", bbeeLevel);
      formData.append("cidbGrading", cidbGrading);
      formData.append("contactPerson", contactPerson);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("bidAmount", bidAmount);
      formData.append("timeframe", timeframe);
      formData.append("message", message);

      documents.forEach((doc) => formData.append("documents", doc));

      await applicationAPI.apply(tender._id, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSubmitted(true);

      // Reset form
      setBidderName("");
      setRegistrationNumber("");
      setBbeeLevel("");
      setCidbGrading("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setBidAmount("");
      setTimeframe("");
      setMessage("");
      setDocuments([]);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <Loader2 className="animate-spin w-12 h-12 text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-center">
              Loading tender details...
            </p>
          </div>
        </div>
      </Layout>
    );

  if (submitted)
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Application Submitted!
            </h2>
            <p className="text-gray-600 mb-6">
              Your tender application has been successfully submitted. You will
              receive a confirmation email shortly.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                onClick={() => setSubmitted(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Submit Another Application
              </Button>
              <Button
                onClick={() => navigate(`/tenders/${id}`)}
                className="bg-gray-600 hover:bg-gray-700 text-white"
              >
                Back to Tender
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-blue-100 rounded-full p-3">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {tender?.title}
                </h1>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  Tender Application
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border-l-4 border-blue-500">
              <p className="text-gray-700 leading-relaxed">
                {tender?.description}
              </p>
            </div>
          </div>

          {/* Application Form */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-xl font-semibold text-white">
                Submit Your Application
              </h2>
              <p className="text-blue-100 mt-1">
                Fill in all required information to apply for this tender
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8">
              {/* Company Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Building className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Company Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Company / Bidder Name"
                    required
                    value={bidderName}
                    onChange={setBidderName}
                    placeholder="Enter company name"
                  />
                  <InputField
                    label="Registration Number"
                    required
                    value={registrationNumber}
                    onChange={setRegistrationNumber}
                    placeholder="Company registration number"
                  />
                  <InputField
                    label="B-BBEE Level"
                    value={bbeeLevel}
                    onChange={setBbeeLevel}
                    placeholder="e.g., Level 4"
                  />
                  <InputField
                    label="CIDB Grading"
                    value={cidbGrading}
                    onChange={setCidbGrading}
                    placeholder="e.g., 7CE"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Contact Person"
                    required
                    value={contactPerson}
                    onChange={setContactPerson}
                    placeholder="Full name"
                  />
                  <InputField
                    label="Email Address"
                    type="email"
                    required
                    value={email}
                    onChange={setEmail}
                    placeholder="email@company.com"
                  />
                  <InputField
                    label="Phone Number"
                    type="tel"
                    required
                    value={phone}
                    onChange={setPhone}
                    placeholder="+27 11 123 4567"
                  />
                </div>
              </div>

              {/* Bid Info */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Bid Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Bid Amount (ZAR)"
                    type="number"
                    required
                    value={bidAmount}
                    onChange={setBidAmount}
                    placeholder="0.00"
                  />
                  <InputField
                    label="Delivery / Completion Timeframe"
                    value={timeframe}
                    onChange={setTimeframe}
                    placeholder="e.g., 3 months"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message / Cover Letter
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a compelling message explaining why your company is the best choice for this tender..."
                  rows={5}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* Documents */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Supporting Documents
                </label>
                <DropzoneArea />
              </div>

              {/* Submit */}
              <div className="border-t pt-6">
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="animate-spin w-5 h-5 mr-2" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-3">
                  By submitting this application, you agree to our terms and
                  conditions
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper InputField component
const InputField = ({
  label,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <Input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      placeholder={placeholder}
      min={type === "number" ? 0 : undefined}
      step={type === "number" ? "0.01" : undefined}
    />
  </div>
);

export default TenderApplicationPage;
