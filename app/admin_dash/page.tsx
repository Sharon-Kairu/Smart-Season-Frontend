'use client'
import { useState, useEffect } from "react";
import DashHeader from "../components/DashHeader";
import AdminCards from "../components/AdminCards";
import EditField from "../components/Modals/EditField";
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
  assigned_to: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  stage: string;
  status: string;
}

interface Agent {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
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
  const [agents, setAgents] = useState<Agent[]>([]);
  const [fieldHistory, setFieldHistory] = useState<FieldHistory[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [loadingAgents, setLoadingAgents] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [notesFieldId, setNotesFieldId] = useState<string | null>(null);
  const [notesFieldName, setNotesFieldName] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const fieldsData = await apiService.getWithToken('/fields/fields/');
      setFields(Array.isArray(fieldsData) ? fieldsData : []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setLoadingFields(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const agentsData = await apiService.getWithToken('/users/agents/');
      setAgents(Array.isArray(agentsData) ? agentsData : []);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoadingAgents(false);
    }
  };

  const fetchHistory = async (fieldsData: Field[]) => {
    try {
      const histories = await Promise.all(
        fieldsData.map(async (field) => {
          try {
            const history = await apiService.getWithToken(`/fields/fields/${field.id}/history/`);
            return Array.isArray(history) ? history.map((h: any) => ({ ...h, fieldName: field.name })) : [];
          } catch {
            return [];
          }
        })
      );
      const allHistory = histories.flat().sort((a: any, b: any) => 
        new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
      );
      setFieldHistory(allHistory);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    if (fields.length > 0) {
      fetchHistory(fields);
    } else {
      setLoadingHistory(false);
    }
  }, [fields]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    await fetchAgents();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleEditClick = (field: Field) => {
    setEditingField(field);
  };

  const handleNotesClick = (fieldId: string, fieldName: string) => {
    setNotesFieldId(fieldId);
    setNotesFieldName(fieldName);
  };

  const getAgentName = (agent: { id: string; full_name: string; email: string } | null) => {
    if (!agent) return 'Unassigned';
    return agent.full_name || agent.email;
  };

  const getAgentFieldCount = (agentId: string) => {
    return fields.filter(f => f.assigned_to?.id === agentId).length;
  };

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
    
  return (
    <div className="bg-gray-100 w-full min-h-screen">
      <DashHeader />

      <div className="p-4 md:p-6 flex flex-col gap-6">
        <AdminCards onSuccess={handleRefresh} />

        {/* FIELDS TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold text-gray-800">
              Current Fields
            </h1>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Refreshing...
                </>
              ) : (
                '🔄 Refresh'
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Field Name</th>
                  <th className="py-2 px-3">Location</th>
                  <th className="py-2 px-3">Crop Type</th>
                  <th className="py-2 px-3">Planting Date</th>
                  <th className="py-2 px-3">Size (Acres)</th>
                  <th className="py-2 px-3">Assigned To</th>
                  <th className="py-2 px-3">Stage</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loadingFields ? (
                  <tr>
                    <td colSpan={9} className="py-4 px-3 text-center text-gray-500">
                      Loading fields...
                    </td>
                  </tr>
                ) : fields.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-4 px-3 text-center text-gray-500">
                      No fields found
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
                        <td className="py-3 px-3 text-gray-700 font-medium">{getAgentName(field.assigned_to)}</td>
                        <td className="py-3 px-3 text-gray-700 font-medium">{getStageBadge(field.stage)} {field.stage.charAt(0).toUpperCase() + field.stage.slice(1)}</td>
                        <td className="py-3 px-3">
                          <span className={`${statusStyle.bg} ${statusStyle.text} px-3 py-1 rounded-full text-xs font-medium`}>
                            {field.status.charAt(0).toUpperCase() + field.status.slice(1).replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditClick(field)}
                              className="bg-gradient-to-r from-green-500 to-green-600 p-2.5 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm hover:shadow-md"
                              title="Edit field"
                            >
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

        {/* AGENTS TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            Agents
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Phone</th>
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Fields Assigned</th>
                  <th className="py-2 px-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {loadingAgents ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-3 text-center text-gray-500">
                      Loading agents...
                    </td>
                  </tr>
                ) : agents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-3 text-center text-gray-500">
                      No agents found
                    </td>
                  </tr>
                ) : (
                  agents.map(agent => {
                    const fieldCount = getAgentFieldCount(agent.id);
                    return (
                      <tr key={agent.id} className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                        <td className="py-3 px-3 font-semibold text-gray-800">
                          {agent.full_name}
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {agent.phone_number || 'N/A'}
                        </td>
                        <td className="py-3 px-3 text-gray-500">
                          {agent.email}
                        </td>
                        <td className="py-3 px-3 text-gray-700 font-medium">
                          {fieldCount} {fieldCount === 1 ? 'Field' : 'Fields'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* FIELD HISTORY TABLE */}
        <div className="bg-white rounded-2xl shadow-md p-5">
          <h1 className="text-lg font-semibold text-gray-800 mb-4">
            Field Update History
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-500 text-sm">
                  <th className="py-2 px-3">Field Name</th>
                  <th className="py-2 px-3">Field Changed</th>
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
                      Loading history...
                    </td>
                  </tr>
                ) : fieldHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-4 px-3 text-center text-gray-500">
                      No field updates yet
                    </td>
                  </tr>
                ) : (
                  fieldHistory.slice(0, 20).map((history: any) => (
                    <tr key={history.id} className="bg-gray-50 hover:bg-green-50 transition rounded-xl">
                      <td className="py-3 px-3 font-semibold text-green-700">
                        {history.fieldName}
                      </td>
                      <td className="py-3 px-3 text-gray-700 font-medium">
                        {history.field_name_display}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {history.old_value || 'None'}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {history.new_value}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {history.changed_by_name}
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-sm">
                        {formatDateTime(history.changed_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Field Modal */}
      <EditField
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        field={editingField}
        agents={agents}
        onSuccess={handleRefresh}
      />

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
