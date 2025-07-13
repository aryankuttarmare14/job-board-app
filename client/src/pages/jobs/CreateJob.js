import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobsApi } from "../../services/api";

const CreateJob = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Create Job</h1>
      <p className="text-gray-700">Job creation form will be here</p>
    </div>
  );
};

export default CreateJob;
