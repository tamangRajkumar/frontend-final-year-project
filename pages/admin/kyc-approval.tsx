import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiDocumentText,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiRefresh,
  HiFilter
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getPendingKYC, verifyKYC } from "../api";
import RoleGuard from "../../src/components/auth/RoleGuard";

// TanStack Table components (assuming they're installed)
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';

interface KYCUser {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  country: string;
  createdAt: string;
  kycInfo: {
    documentType: string;
    documentNumber: string;
    documentImage: {
      url: string;
      public_id: string;
    };
    isVerified: boolean;
  };
  businessInfo?: {
    businessName: string;
    businessType: string;
  };
}

const columnHelper = createColumnHelper<KYCUser>();

const KYCApproval: NextPage = () => {
  const [data, setData] = useState<KYCUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedUser, setSelectedUser] = useState<KYCUser | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);

  const columns = [
    columnHelper.accessor('fname', {
      header: 'Name',
      cell: (info) => {
        const user = info.row.original;
        return (
          <div>
            <div className="font-medium text-gray-900">
              {user.fname} {user.lname}
            </div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        );
      },
    }),
    columnHelper.accessor('role', {
      header: 'Role',
      cell: (info) => {
        const role = info.getValue();
        const user = info.row.original;
        return (
          <div>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              role === 'admin' ? 'bg-red-100 text-red-800' :
              role === 'business' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {role}
            </span>
            {user.businessInfo && (
              <div className="text-xs text-gray-500 mt-1">
                {user.businessInfo.businessName}
              </div>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('kycInfo.documentType', {
      header: 'Document Type',
      cell: (info) => {
        const docType = info.getValue();
        return (
          <span className="capitalize">
            {docType === 'pan_card' ? 'PAN Card' : docType}
          </span>
        );
      },
    }),
    columnHelper.accessor('kycInfo.documentNumber', {
      header: 'Document Number',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('country', {
      header: 'Country',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Submitted',
      cell: (info) => {
        const date = new Date(info.getValue());
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      },
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewKYC(user)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center text-sm"
            >
              <HiEye className="h-4 w-4 mr-1" />
              View
            </button>
            <button
              onClick={() => handleApprove(user, 'approve')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors flex items-center text-sm"
            >
              <HiCheckCircle className="h-4 w-4 mr-1" />
              Approve
            </button>
            <button
              onClick={() => handleApprove(user, 'reject')}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center text-sm"
            >
              <HiXCircle className="h-4 w-4 mr-1" />
              Reject
            </button>
          </div>
        );
      },
    }),
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (token) {
      fetchPendingKYC();
    }
  }, [token]);

  const fetchPendingKYC = async () => {
    try {
      setLoading(true);
      const { data } = await getPendingKYC({}, token);
      
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      console.error("Error fetching pending KYC:", error);
      toast.error("Failed to fetch pending KYC verifications");
    } finally {
      setLoading(false);
    }
  };

  const handleViewKYC = (user: KYCUser) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleApprove = (user: KYCUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const handleConfirmApproval = async () => {
    if (!selectedUser || !approvalAction) return;

    try {
      setProcessing(true);
      const isVerified = approvalAction === 'approve';
      const { data } = await verifyKYC(
        selectedUser._id, 
        isVerified, 
        approvalAction === 'reject' ? rejectionReason : '', 
        token
      );
      
      if (data.success) {
        toast.success(data.message);
        setShowApprovalModal(false);
        setSelectedUser(null);
        setApprovalAction(null);
        setRejectionReason('');
        fetchPendingKYC();
      }
    } catch (error) {
      console.error("Error processing KYC:", error);
      toast.error("Failed to process KYC verification");
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <HiDocumentText className="h-8 w-8 mr-3 text-blue-600" />
                  KYC Approval
                </h1>
                <p className="text-gray-600 mt-2">
                  Review and approve user KYC documents
                </p>
              </div>
              <button
                onClick={fetchPendingKYC}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                <HiRefresh className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={(table.getColumn('fname')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('fname')?.setFilterValue(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="w-48">
                <select
                  value={(table.getColumn('role')?.getFilterValue() as string) ?? ''}
                  onChange={(e) =>
                    table.getColumn('role')?.setFilterValue(e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Roles</option>
                  <option value="user">Users</option>
                  <option value="business">Businesses</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map(headerGroup => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            <div className="flex items-center">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                              {{
                                asc: ' 🔼',
                                desc: ' 🔽',
                              }[header.column.getIsSorted() as string] ?? null}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {table.getRowModel().rows.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* KYC View Modal */}
          {showViewModal && selectedUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      KYC Document - {selectedUser.fname} {selectedUser.lname}
                    </h3>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Document Type</label>
                        <p className="text-sm text-gray-900 capitalize">
                          {selectedUser.kycInfo.documentType === 'pan_card' ? 'PAN Card' : selectedUser.kycInfo.documentType}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Document Number</label>
                        <p className="text-sm text-gray-900">{selectedUser.kycInfo.documentNumber}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Document Image</label>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        <img
                          src={selectedUser.kycInfo.documentImage.url}
                          alt="KYC Document"
                          className="max-w-full h-auto rounded-lg shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Approval Modal */}
          {showApprovalModal && selectedUser && approvalAction && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {approvalAction === 'approve' ? 'Approve' : 'Reject'} KYC Verification
                    </h3>
                    <button
                      onClick={() => setShowApprovalModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to {approvalAction} the KYC verification for{' '}
                      <span className="font-medium">{selectedUser.fname} {selectedUser.lname}</span>?
                    </p>
                    
                    {approvalAction === 'reject' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (Optional)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder="Enter reason for rejection..."
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowApprovalModal(false)}
                      disabled={processing}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmApproval}
                      disabled={processing}
                      className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                        approvalAction === 'approve'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                    >
                      {processing ? 'Processing...' : `${approvalAction === 'approve' ? 'Approve' : 'Reject'}`}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
};

export default KYCApproval;

