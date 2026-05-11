"use client";

import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({
    name: "",
    date: "",
    venue: "",
    description: "",
  });

  const handleChange = (field: string, value: string) => {
    setEvent(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // In a real app, you would save the changes here.
    navigate(-1); // go back to the previous page
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Event Name</label>
          <input
            type="text"
            value={event.name}
            onChange={e => handleChange("name", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input
            type="date"
            value={event.date}
            onChange={e => handleChange("date", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Venue</label>
          <input
            type="text"
            value={event.venue}
            onChange={e => handleChange("venue", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={event.description}
            onChange={e => handleChange("description", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <Button type="button" onClick={handleSubmit} className="w-full bg-[#e94560] hover:bg-[#d43d56] text-white py-2 rounded-md">
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default EditEvent;