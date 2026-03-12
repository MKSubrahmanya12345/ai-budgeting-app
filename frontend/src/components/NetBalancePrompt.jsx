import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';

const NetBalancePrompt = () => {
  const [netBalance, setNetBalance] = useState('');
  const { user, updateNetBalance } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateNetBalance(netBalance);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Set Your Net Balance</h2>
        <p className="mb-4">Please provide your current net balance to continue.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={netBalance}
            onChange={(e) => setNetBalance(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            placeholder="Enter your net balance"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NetBalancePrompt;
