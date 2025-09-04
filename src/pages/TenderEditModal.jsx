// src/components/TenderEditModal.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { tenderAPI } from "../services/api";

const TenderEditModal = ({ isOpen, onClose, tender, onUpdate }) => {
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

  useEffect(() => {
    if (tender) {
      setFormData({
        title: tender.title || "",
        description: tender.description || "",
        category: tender.category || "",
        budgetMin: tender.budgetMin || "",
        budgetMax: tender.budgetMax || "",
        deadline: tender.deadline?.slice(0, 10) || "",
        companyName: tender.companyName || "",
        registrationNumber: tender.registrationNumber || "",
        bbeeLevel: tender.bbeeLevel || "",
        cidbGrading: tender.cidbGrading || "",
        contactPerson: tender.contactPerson || "",
        contactEmail: tender.contactEmail || "",
        contactPhone: tender.contactPhone || "",
      });
    }
  }, [tender]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await tenderAPI.update(tender._id, formData);
      onUpdate(res?.data?.tender || res?.data);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update tender");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Tender</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Tender Title"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              name="budgetMin"
              type="number"
              value={formData.budgetMin}
              onChange={handleChange}
              placeholder="Budget Min"
              className="w-1/2 p-2 border rounded"
            />
            <input
              name="budgetMax"
              type="number"
              value={formData.budgetMax}
              onChange={handleChange}
              placeholder="Budget Max"
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Company Name"
            className="w-full p-2 border rounded"
          />
          <input
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            placeholder="Registration Number"
            className="w-full p-2 border rounded"
          />
          <div className="flex gap-2">
            <input
              name="bbeeLevel"
              value={formData.bbeeLevel}
              onChange={handleChange}
              placeholder="BBBEE Level"
              className="w-1/2 p-2 border rounded"
            />
            <input
              name="cidbGrading"
              value={formData.cidbGrading}
              onChange={handleChange}
              placeholder="CIDB Grade"
              className="w-1/2 p-2 border rounded"
            />
          </div>
          <input
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Contact Person"
            className="w-full p-2 border rounded"
          />
          <input
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            placeholder="Contact Email"
            className="w-full p-2 border rounded"
          />
          <input
            name="contactPhone"
            value={formData.contactPhone}
            onChange={handleChange}
            placeholder="Contact Phone"
            className="w-full p-2 border rounded"
          />
          <DialogFooter className="flex gap-2 justify-end">
            <Button type="submit">Save Changes</Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TenderEditModal;
