import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { 
  HiUsers,
  HiEye,
  HiTrash,
  HiShieldExclamation,
  HiRefresh,
  HiSearch,
  HiFilter
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getUsersList, deleteUser, unverifyKYC } from "../api";
import RoleGuard from "../../src/components/auth/RoleGuard";

// TanStack Table components
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

interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  country: string;
  gender: string;
  createdAt: string;
  kycInfo?: {
    documentType: string;
    documentNumber: string;
    documentImage: {
      url: string;
      public_id: string;
    };
    isVerified: boolean;
    verifiedAt?: string;
    rejectionReason?: string;
  };
  businessInfo?: {
    businessName: string;
    businessType: string;
    isVerified: boolean;
  };
  userProfileImage?: {
    url: string;
    public_id: string;
  };
}

const columnHelper = createColumnHelper<User>();

const UsersTable: NextPage = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  const columns = [
    columnHelper.accessor('fname', {
      header: 'User',
      cell: (info) => {
        const user = info.row.original;
        return (
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
              {user.userProfileImage?.url ? (
                <img
                  src={user.userProfileImage.url}
                  alt={user.fname}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 font-semibold text-sm">
                  {user.fname?.charAt(0)}{user.lname?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">
                {user.fname} {user.lname}
              </div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
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
    columnHelper.accessor('kycInfo.isVerified', {
      header: 'KYC Status',
      cell: (info) => {
        const isVerified = info.getValue();
        const user = info.row.original;
        
        if (!user.kycInfo) {
          return <span className="text-gray-400 text-sm">No KYC</span>;
        }
        
        return (
          <div className="flex items-center">
            {isVerified ? (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Verified
              </span>
            ) : (
              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                Pending
              </span>
            )}
          </div>
        );
      },
    }),
    columnHelper.accessor('kycInfo.documentType', {
      header: 'Document Type',
      cell: (info) => {
        const docType = info.getValue();
        if (!docType) return <span className="text-gray-400">-</span>;
        return (
          <span className="capitalize text-sm">
            {docType === 'pan_card' ? 'PAN Card' : docType}
          </span>
        );
      },
    }),
    columnHelper.accessor('country', {
      header: 'Country',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('createdAt', {
      header: 'Joined',
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
              onClick={() => handleViewUser(user)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors flex items-center text-sm"
            >
              <HiEye className="h-4 w-4 mr-1" />
              View
            </button>
            {user.kycInfo?.isVerified && (
              <button
                onClick={() => handleUnverifyKYC(user)}
                className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 transition-colors flex items-center text-sm"
              >
                <HiShieldExclamation className="h-4 w-4 mr-1" />
                Unverify
              </button>
            )}
            {user.role !== 'admin' && (
              <button
                onClick={() => handleDeleteUser(user)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors flex items-center text-sm"
              >
                <HiTrash className="h-4 w-4 mr-1" />
                Delete
              </button>
            )}
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
      fetchUsers();
    }
  }, [token, pagination.currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(table.getColumn('fname')?.getFilterValue() && { 
          search: table.getColumn('fname')?.getFilterValue() 
        }),
        ...(table.getColumn('role')?.getFilterValue() && { 
          role: table.getColumn('role')?.getFilterValue() 
        })
      };

      const { data } = await getUsersList(params, token);
      
      if (data.success) {
        setData(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleUnverifyKYC = async (user: User) => {
    if (!user.kycInfo?.isVerified) return;

    try {
      setProcessing(true);
      const { data } = await unverifyKYC(user._id, token);
      
      if (data.success) {
        toast.success(data.message);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error unverifying KYC:", error);
      toast.error("Failed to unverify KYC");
    } finally {
      setProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;

    try {
      setProcessing(true);
      const { data } = await deleteUser(selectedUser._id, token);
      
      if (data.success) {
        toast.success(data.message);
        setShowDeleteModal(false);
        setSelectedUser(null);
        fetchUsers();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    } finally {
      setProcessing(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, currentPage: newPage }));
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
                  <HiUsers className="h-8 w-8 mr-3 text-blue-600" />
                  Users Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage all users, view details, and control access
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Total Users: {pagination.totalUsers}
                </div>
                <button
                  onClick={fetchUsers}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
                >
                  <HiRefresh className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
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
                  <option value="admin">Admins</option>
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

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow mt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{' '}
                    <span className="font-medium">
                      {(pagination.currentPage - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)}
                    </span>{' '}
                    of{' '}
                    <span className="font-medium">{pagination.totalUsers}</span>{' '}
                    results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.currentPage - 1)}
                      disabled={!pagination.hasPrevPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pagination.currentPage
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => handlePageChange(pagination.currentPage + 1)}
                      disabled={!pagination.hasNextPage}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* User Detail Modal */}
          {showViewModal && selectedUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      User Details - {selectedUser.fname} {selectedUser.lname}
                    </h3>
                    <button
                      onClick={() => setShowViewModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <p className="text-sm text-gray-900">{selectedUser.fname} {selectedUser.lname}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedUser.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedUser.role === 'admin' ? 'bg-red-100 text-red-800' :
                          selectedUser.role === 'business' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedUser.role}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <p className="text-sm text-gray-900">{selectedUser.country}</p>
                      </div>
                    </div>

                    {/* KYC Info */}
                    {selectedUser.kycInfo && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">KYC Information</h4>
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Verification Status</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedUser.kycInfo.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedUser.kycInfo.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                          {selectedUser.kycInfo.verifiedAt && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700">Verified At</label>
                              <p className="text-sm text-gray-900">{formatDate(selectedUser.kycInfo.verifiedAt)}</p>
                            </div>
                          )}
                        </div>
                        {selectedUser.kycInfo.documentImage?.url && (
                          <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Document Image</label>
                            <img
                              src={selectedUser.kycInfo.documentImage.url}
                              alt="KYC Document"
                              className="max-w-full h-auto rounded-lg shadow-sm border"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* Business Info */}
                    {selectedUser.businessInfo && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Business Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Business Name</label>
                            <p className="text-sm text-gray-900">{selectedUser.businessInfo.businessName}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Business Type</label>
                            <p className="text-sm text-gray-900">{selectedUser.businessInfo.businessType}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Business Verification</label>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              selectedUser.businessInfo.isVerified 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {selectedUser.businessInfo.isVerified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
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

          {/* Delete Confirmation Modal */}
          {showDeleteModal && selectedUser && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Delete User</h3>
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Are you sure you want to delete{' '}
                      <span className="font-medium">{selectedUser.fname} {selectedUser.lname}</span>?
                    </p>
                    <p className="text-sm text-red-600">
                      This action cannot be undone. All user data will be permanently deleted.
                    </p>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      disabled={processing}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={processing}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                      {processing ? 'Deleting...' : 'Delete'}
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

export default UsersTable;
