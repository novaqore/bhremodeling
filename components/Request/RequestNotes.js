import React, { useState, useEffect } from 'react';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase/init';

const RequestsNotes = ({ request, notes, setNotes }) => {


  return (
    <div className="bg-white rounded-lg shadow p-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Notes</h2>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Add notes about this transaction..."
        className="w-full min-h-[128px] p-2 mb-4 border rounded-md resize-y"
      />
    </div>
  );
};

export default RequestsNotes;