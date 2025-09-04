import React, { useEffect, useState } from "react";
import { useTender } from "../contexts/TenderContext";
import {
  Building,
  FileText,
  User,
  Upload,
  Eye,
  Save,
  Send,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  Hash,
  Award,
  Briefcase,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";

const CreateTenderForm = () => {
  const { createTender } = useTender(); // get createTender function from context
  const [activeTab, setActiveTab] = useState("basic");
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    companyName: "",
    registrationNumber: "",
    bbeeLevel: "",
    cidbGrading: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [published, setPublished] = useState(false);

  const DRAFT_KEY = "create_tender_draft_v1";
  const DRAFT_TAB_KEY = "create_tender_tab_v1";

  // Restore draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY);
      const savedTab = localStorage.getItem(DRAFT_TAB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
      if (savedTab) setActiveTab(savedTab);
    } catch {
      // Ignore errors: localStorage may be unavailable or JSON may be malformed
    }
  }, []);

  // Persist form data
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {
      // Ignore errors: localStorage may be unavailable or JSON may be malformed
    }
  }, [formData]);

  // Persist active tab
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_TAB_KEY, activeTab);
    } catch {
      // Ignore errors: localStorage may be unavailable or JSON may be malformed
    }
  }, [activeTab]);

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    } catch {
      toast.error("Failed to save draft");
    }
  };

  const categories = [
    "Construction",
    "IT Services",
    "Consulting",
    "Engineering",
    "Other",
  ];
  const bbeeLevels = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const cidbGradings = ["1GB", "2GB", "3GB", "4GB", "5GB", "6GB"];

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FileText },
    { id: "company", label: "Company", icon: Building },
    { id: "contact", label: "Contact", icon: User },
    { id: "files", label: "Files", icon: Upload },
    { id: "review", label: "Review", icon: Eye },
  ];

  // Helper function to check if a tab is completed
  const isTabCompleted = (tabId) => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);
    return tabIndex < currentIndex;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateTab = (tabId) => {
    const newErrors = {};
    if (tabId === "basic") {
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.description)
        newErrors.description = "Description is required";
      if (!formData.category) newErrors.category = "Category is required";
      if (!formData.budgetMin) newErrors.budgetMin = "Min budget is required";
      if (!formData.budgetMax) newErrors.budgetMax = "Max budget is required";
      if (!formData.deadline) newErrors.deadline = "Deadline is required";
    } else if (tabId === "company") {
      if (!formData.companyName)
        newErrors.companyName = "Company name is required";
      if (!formData.registrationNumber)
        newErrors.registrationNumber = "Registration number is required";
      if (!formData.bbeeLevel) newErrors.bbeeLevel = "BBBEE level is required";
      if (!formData.cidbGrading)
        newErrors.cidbGrading = "CIDB grading is required";
    } else if (tabId === "contact") {
      if (!formData.contactPerson)
        newErrors.contactPerson = "Contact person is required";
      if (!formData.contactEmail) newErrors.contactEmail = "Email is required";
      if (!formData.contactPhone) newErrors.contactPhone = "Phone is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateTab(activeTab)) {
      const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
      if (currentIndex < tabs.length - 1)
        setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id);
  };

  const handleFileUpload = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      console.log("Submitting tender with data:", formData, files);

      // Ensure files is always an array
      const filesArray = Array.isArray(files) ? files : [];

      // Convert to correct types
      const dataToSend = {
        ...formData,
        budgetMin: formData.budgetMin ? Number(formData.budgetMin) : undefined,
        budgetMax: formData.budgetMax ? Number(formData.budgetMax) : undefined,
        deadline: formData.deadline
          ? new Date(formData.deadline).toISOString()
          : undefined,
      };

      // Call createTender from context
      const response = await createTender(
        dataToSend,
        filesArray,
        (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("Upload progress:", progress, "%");
          }
        }
      );

      if (response?.success) {
        try {
          localStorage.removeItem(DRAFT_KEY);
          localStorage.removeItem(DRAFT_TAB_KEY);
        } catch {
          // Ignore errors
        }
        setPublished(true);
        setFormData({
          title: "",
          description: "",
          category: "",
          budgetMin: "",
          budgetMax: "",
          deadline: "",
          companyName: "",
          registrationNumber: "",
          bbeeLevel: "",
          cidbGrading: "",
          contactPerson: "",
          contactEmail: "",
          contactPhone: "",
        });
        setFiles([]);
        toast.success("Tender created successfully!");
        setActiveTab("basic");
      } else {
        toast.error(response?.error || "Failed to create tender");
        console.error("Tender creation error:", response?.error);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while creating the tender");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showSidebar>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Create New Tender
            </h1>
            <p className="text-gray-600">
              Fill out the form below to create your tender listing
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                const isActive = tab.id === activeTab;
                const isCompleted = isTabCompleted(tab.id);
                const isPast =
                  tabs.findIndex((t) => t.id === activeTab) > index;

                return (
                  <div key={tab.id} className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg scale-110"
                          : isCompleted || isPast
                          ? "bg-green-500 border-green-500 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {isCompleted || isPast ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Icon size={20} />
                      )}
                    </div>
                    <span
                      className={`text-sm mt-2 font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted || isPast
                          ? "text-green-600"
                          : "text-gray-400"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    ((tabs.findIndex((t) => t.id === activeTab) + 1) /
                      tabs.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            {activeTab === "basic" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <FileText className="mr-3 text-blue-600" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tender Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.title ? "border-red-400" : "border-gray-200"
                      }`}
                      placeholder="Enter tender title"
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all resize-none ${
                        errors.description
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder="Provide detailed description of your tender requirements"
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        handleInputChange("category", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.category ? "border-red-400" : "border-gray-200"
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <DollarSign className="inline mr-1" size={16} />
                        Minimum Budget (R) *
                      </label>
                      <input
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) =>
                          handleInputChange("budgetMin", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                          errors.budgetMin
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                        placeholder="0"
                      />
                      {errors.budgetMin && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.budgetMin}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <DollarSign className="inline mr-1" size={16} />
                        Maximum Budget (R) *
                      </label>
                      <input
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) =>
                          handleInputChange("budgetMax", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                          errors.budgetMax
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                        placeholder="0"
                      />
                      {errors.budgetMax && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.budgetMax}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Calendar className="inline mr-1" size={16} />
                      Submission Deadline *
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) =>
                        handleInputChange("deadline", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.deadline ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    {errors.deadline && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.deadline}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "company" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Building className="mr-3 text-blue-600" />
                  Company Information
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Briefcase className="inline mr-1" size={16} />
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        handleInputChange("companyName", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.companyName
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter company name"
                    />
                    {errors.companyName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.companyName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Hash className="inline mr-1" size={16} />
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      value={formData.registrationNumber}
                      onChange={(e) =>
                        handleInputChange("registrationNumber", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.registrationNumber
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter registration number"
                    />
                    {errors.registrationNumber && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.registrationNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Award className="inline mr-1" size={16} />
                        BBBEE Level *
                      </label>
                      <select
                        value={formData.bbeeLevel}
                        onChange={(e) =>
                          handleInputChange("bbeeLevel", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                          errors.bbeeLevel
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select BBBEE level</option>
                        {bbeeLevels.map((level) => (
                          <option key={level} value={level}>
                            Level {level}
                          </option>
                        ))}
                      </select>
                      {errors.bbeeLevel && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.bbeeLevel}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CIDB Grading *
                      </label>
                      <select
                        value={formData.cidbGrading}
                        onChange={(e) =>
                          handleInputChange("cidbGrading", e.target.value)
                        }
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                          errors.cidbGrading
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      >
                        <option value="">Select CIDB grading</option>
                        {cidbGradings.map((grading) => (
                          <option key={grading} value={grading}>
                            {grading}
                          </option>
                        ))}
                      </select>
                      {errors.cidbGrading && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.cidbGrading}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <User className="mr-3 text-blue-600" />
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline mr-1" size={16} />
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) =>
                        handleInputChange("contactPerson", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.contactPerson
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder="Enter contact person name"
                    />
                    {errors.contactPerson && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="inline mr-1" size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        handleInputChange("contactEmail", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.contactEmail
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder="contact@company.com"
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Phone className="inline mr-1" size={16} />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        handleInputChange("contactPhone", e.target.value)
                      }
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all ${
                        errors.contactPhone
                          ? "border-red-400"
                          : "border-gray-200"
                      }`}
                      placeholder="+27 11 123 4567"
                    />
                    {errors.contactPhone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.contactPhone}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "files" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Upload className="mr-3 text-blue-600" />
                  Upload Documents
                </h2>

                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-blue-50 hover:bg-blue-100 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Upload Tender Documents
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    Choose Files
                  </label>
                  <p className="text-sm text-gray-500 mt-2">
                    Maximum file size: 50MB per file
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-700">
                      Uploaded Files
                    </h3>
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <span className="text-gray-700">{file.name}</span>
                          <span className="text-gray-500 ml-2">
                            ({Math.round(file.size / 1024)}KB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="!text-red-500 hover:!text-red-700 !bg-transparent font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "review" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Eye className="mr-3 text-blue-600" />
                  Review Tender
                </h2>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-6">
                  <p className="text-blue-800">
                    Please review all information carefully before submitting
                    your tender.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <FileText className="mr-2" size={18} />
                      Basic Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Title:</strong>{" "}
                        {formData.title || "Not specified"}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {formData.description || "Not specified"}
                      </p>
                      <p>
                        <strong>Category:</strong>{" "}
                        {formData.category || "Not specified"}
                      </p>
                      <p>
                        <strong>Budget:</strong> R{formData.budgetMin || "0"} -
                        R{formData.budgetMax || "0"}
                      </p>
                      <p>
                        <strong>Deadline:</strong>{" "}
                        {formData.deadline || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <Building className="mr-2" size={18} />
                      Company Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Company:</strong>{" "}
                        {formData.companyName || "Not specified"}
                      </p>
                      <p>
                        <strong>Registration:</strong>{" "}
                        {formData.registrationNumber || "Not specified"}
                      </p>
                      <p>
                        <strong>BBBEE Level:</strong>{" "}
                        {formData.bbeeLevel || "Not specified"}
                      </p>
                      <p>
                        <strong>CIDB Grading:</strong>{" "}
                        {formData.cidbGrading || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <User className="mr-2" size={18} />
                      Contact Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Contact Person:</strong>{" "}
                        {formData.contactPerson || "Not specified"}
                      </p>
                      <p>
                        <strong>Email:</strong>{" "}
                        {formData.contactEmail || "Not specified"}
                      </p>
                      <p>
                        <strong>Phone:</strong>{" "}
                        {formData.contactPhone || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                      <Upload className="mr-2" size={18} />
                      Documents
                    </h3>
                    <p className="text-sm">
                      <strong>Files uploaded:</strong> {files.length} file(s)
                    </p>
                    {files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {files.map((file, index) => (
                          <p key={index} className="text-xs text-gray-600">
                            • {file.name}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={activeTab === "basic"}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === "basic"
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowLeft className="mr-2" size={18} /> Back
            </button>

            <div className="flex space-x-4">
              <button
                onClick={saveDraft}
                type="button"
                className="flex items-center px-4 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
              >
                <Save className="mr-2" size={18} /> Save Draft
              </button>
              {activeTab === "review" ? (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  <Send className="mr-2" size={18} />{" "}
                  {loading ? "Publishing..." : "Publish Tender"}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                >
                  Next Step <ArrowRight className="ml-2" size={18} />
                </button>
              )}
            </div>
          </div>

          {published && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 shadow-xl max-w-md w-full text-center">
                <CheckCircle className="mx-auto text-green-600" size={48} />
                <h2 className="text-2xl font-bold mt-4">Tender Published!</h2>
                <p className="text-gray-700 mt-2 mb-6">
                  Your tender has been successfully published.
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setPublished(false)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                  >
                    Create Another Tender
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateTenderForm;
