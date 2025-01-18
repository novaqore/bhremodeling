import React, { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase/init';

const TransactionNotes = ({ request }) => {

  const handleSaveNotes = async (e) => {
    try {
      await update(ref(db, `/requests/-${request.id}` ), {
        notes: e.target.value
      });
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };


  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Notes</h2>
      <textarea
        value={request.notes}
        onChange={(e) => handleSaveNotes(e)}
        placeholder="Add notes about this transaction..."
        className="w-full min-h-[128px] p-2 mb-4 border rounded-md resize-y"
      />
    </div>
  );
};

export default TransactionNotes;