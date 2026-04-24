'use client'
import { useState, useEffect } from "react";
import DashHeader from "../components/DashHeader";
import FieldNotes from "../components/Modals/FieldNotes";
import { FaEdit, FaBook } from "react-icons/fa";
import apiService from "../services/apiService";

interface Field {
  id: string;
  name: string;
  location: string;
  crop_type: string;
  planting_date: string;
  size_in_acres: number;
  stage: string;
  status: string;
}

interface FieldNote {
  id: string;
  field: string;
  note: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

interface FieldHistory {
  id: string;
  field: string;
  field_name: string;
  field_name_display: string;
  old_value: string;
  new_value: string;
  changed_at: string;
  changed_by_name: string;
}

const page = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [notes, setNotes] = useState<FieldNote[]>([]);
  const [history, setHistory] = useState<FieldHistory[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [notesFieldId, setNotesFieldId] = useState<string | null>(null);
  const [notesFieldName, setNotesFieldName] = useState('');

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const fieldsData = await apiService.getWithToken('/fields/fields/');
        setFields(Array.isArray(fieldsData) ? fieldsData : []);
      } catch (error) {
        console.error('Error fetching fields:', error);
      } finally {
        setLoadingFields(false);
      }
    };

    fetchFields();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const notesData = await apiService.getWithToken('/fields/notes/');
        setNotes(Array.isArray(notesData) ? notesData : []);
      } catch (error) {
        console.error('Error fetching notes:', error);
      } finally {
        setLoadingNotes(false);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Fetch history for all assigned fields
        const histories = await Promise.all(
          fields.map(async (field) => {
            try {
              const fieldHistory = await apiService.getWithToken(`/fields/fields/${field.id}/history/`);
              return Array.isArray(fieldHistory) ? fieldHistory.map((h: any) => ({ ...h, fieldName: field.name })) : [];
            } catch {
              return [];
            }
          })
        );
        const allHistory = histories.flat().sort((a: any, b: any) => 
          new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
        );
        setHistory(allHistory);
      } catch (error) {
        console.error('Error fetching history:', error);
      } finally {
        setLoadingHistory(false);
      }
    };

    if (fields.length > 0) {
      fetchHistory();
    } else {
      setLoadingHistory(false);
    }
  }, [fields]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: { [key: string]: { bg: string; text: string } } = {
      'active': { bg: 'bg-green-100', text: 'text-green-700' },
      'at_risk': { bg: 'bg-yellow-100', text: 'text-yellow-700' },
      'completed': { bg: 'bg-blue-100', text: 'text-blue-700' },
    };
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
    return style;
  };

  const getStageBadge = (stage: string) => {
    const stageEmoji: { [key: string]: string } = {
      'planted': '🌱',
      'growing': '🌿',
      'ready': '✅',
      'harvested': '🌾',
    };
    return stageEmoji[stage] || stage;
  };

  const handleNotesClick = (fieldId: string, fieldName: string) => {
    setNotesFieldId(fieldId);
    setNotesFieldName(fieldName);
  };
    
  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <DashHeader />

      <div className="p-4 md:p-6 flex flex-col gap-6">

        {/* MY FIELDS TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            My Fields
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Field Name</th>
                  <th className="py-2 px-3">Location</th>
                  <th className="py-2 px-3">Crop Type</th>
                  <th className="py-2 px-3">Planting Date</th>
                  <th className="py-2 px-3">Size (Acres)</th>
                  <th className="py-2 px-3">Stage</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loadingFields ? (
                  <tr>
                    <td colSpan={8} className="py-4 px-3 text-center text-gray-500">
                      Loading fields...
                    </td>
                  </tr>
                ) : fields.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-4 px-3 text-center text-gray-500">
                      No fields assigned to you yet
                    </td>
                  </tr>
                ) : (
                  fields.map(field => {
                    const statusStyle = getStatusBadge(field.status);
                    return (
                      <tr key={field.id} className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                        <td className="py-3 px-3 font-semibold text-green-700">
                          {field.name}
                        </td>
                        <td className="py-3 px-3 text-gray-600">{field.location}</td>
                        <td className="py-3 px-3 text-gray-500">{field.crop_type}</td>
                        <td className="py-3 px-3 text-gray-500">{formatDate(field.planting_date)}</td>
                        <td className="py-3 px-3 text-gray-700 font-medium">{field.size_in_acres}</td>
                        <td className="py-3 px-3 text-gray-700 font-medium">{getStageBadge(field.stage)} {field.stage.charAt(0).toUpperCase() + field.stage.slice(1)}</td>
                        <td className="py-3 px-3">
                          <span className={`${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-xs font-medium`}>
                            {field.status.charAt(0).toUpperCase() + field.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md" title="Edit field">
                              <FaEdit size={16} />
                            </button>
                            <button 
                              onClick={() => handleNotesClick(field.id, field.name)}
                              className="bg-gradient-to-r from-blue-500 to-blue-600 p-2.5 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
                              title="View/Add notes"
                            >
                              <FaBook size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FIELD NOTES TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            📝 Field Notes
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Field</th>
                  <th className="py-2 px-3">Note</th>
                  <th className="py-2 px-3">Author</th>
                  <th className="py-2 px-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {loadingNotes ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-3 text-center text-gray-500">
                      Loading notes...
                    </td>
                  </tr>
                ) : notes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 px-3 text-center text-gray-500">
                      No notes yet
                    </td>
                  </tr>
                ) : (
                  notes.map(note => (
                    <tr key={note.id} className="bg-gray-50 hover:bg-blue-50 transition rounded-xl">
                      <td className="py-3 px-3 font-semibold text-green-700">
                        {note.field}
                      </td>
                      <td className="py-3 px-3 text-gray-700 max-w-xs truncate">
                        {note.note}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {note.author_name}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-sm">
                        {formatDateTime(note.created_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FIELD UPDATES TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            🔄 Field Updates
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Field Name</th>
                  <th className="py-2 px-3">What Changed</th>
                  <th className="py-2 px-3">Old Value</th>
                  <th className="py-2 px-3">New Value</th>
                  <th className="py-2 px-3">Changed By</th>
                  <th className="py-2 px-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {loadingHistory ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-3 text-center text-gray-500">
                      Loading updates...
                    </td>
                  </tr>
                ) : history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-3 text-center text-gray-500">
                      No field updates yet
                    </td>
                  </tr>
                ) : (
                  history.slice(0, 20).map((item: any) => (
                    <tr key={item.id} className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                      <td className="py-3 px-3 font-semibold text-green-700">
                        {item.fieldName}
                      </td>
                      <td className="py-3 px-3 text-gray-700 font-medium">
                        {item.field_name_display}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {item.old_value || 'None'}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {item.new_value}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {item.changed_by_name}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-sm">
                        {formatDateTime(item.changed_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Field Notes Modal */}
      <FieldNotes
        isOpen={!!notesFieldId}
        onClose={() => setNotesFieldId(null)}
        fieldId={notesFieldId}
        fieldName={notesFieldName}
      />
    </div>
  );
};

export default page;
