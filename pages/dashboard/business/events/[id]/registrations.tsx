import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { 
  HiArrowLeft,
  HiUsers,
  HiMail,
  HiPhone,
  HiCalendar,
  HiDownload,
  HiRefresh,
  HiEye,
  HiCheckCircle,
  HiXCircle,
  HiClock
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getEventById, getEventRegistrations } from "../../../../api/index";

interface EventRegistration {
  _id: string;
  user: {
    _id: string;
    fname: string;
    lname: string;
    email: string;
    userProfileImage?: {
      url: string;
      public_id: string;
    };
  };
  registrationDate: string;
  status: 'registered' | 'attended' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  additionalInfo?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  maxAttendees: number;
  registrationFee: number;
  currency: string;
  organizer: {
    _id: string;
    fname: string;
    lname: string;
  };
  registeredUsers: EventRegistration[];
}

const EventRegistrationsPage: NextPage = () => {
  const [event, setEvent] = useState<Event | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  const router = useRouter();
  const { id } = router.query;
  const token = useSelector((state: any) => state.authUser.token);
  const currentUser = useSelector((state: any) => state.authUser.currentUser);

  useEffect(() => {
    if (id && token) {
      fetchEventAndRegistrations();
    }
  }, [id, token]);

  useEffect(() => {
    // Check if user has business role
    if (currentUser && currentUser.role !== "business") {
      router.push("/dashboard/user");
      toast.error("Access denied. Business account required.");
    }
  }, [currentUser, router]);

  const fetchEventAndRegistrations = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const eventResponse = await getEventById(id as string, token);
      if (eventResponse.data.success) {
        const eventData = eventResponse.data.data;
        
        // Check if user owns this event
        if (eventData.organizer._id !== currentUser._id) {
          toast.error("You can only view registrations for your own events");
          router.push("/dashboard/business");
          return;
        }
        
        setEvent(eventData);
        setRegistrations(eventData.registeredUsers || []);
      }
    } catch (error) {
      console.error("Error fetching event and registrations:", error);
      toast.error("Failed to fetch event registrations");
      router.push("/dashboard/business");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventAndRegistrations();
    setRefreshing(false);
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

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered':
        return 'bg-blue-100 text-blue-800';
      case 'attended':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'refunded':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRegistrations = registrations.filter(registration => {
    const statusMatch = filterStatus === 'all' || registration.status === filterStatus;
    const paymentMatch = filterPayment === 'all' || registration.paymentStatus === filterPayment;
    return statusMatch && paymentMatch;
  });

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Registration Date', 'Status', 'Payment Status', 'Additional Info'];
    const csvContent = [
      headers.join(','),
      ...filteredRegistrations.map(reg => [
        `"${reg.user.fname} ${reg.user.lname}"`,
        `"${reg.user.email}"`,
        `"${formatDate(reg.registrationDate)}"`,
        `"${reg.status}"`,
        `"${reg.paymentStatus}"`,
        `"${reg.additionalInfo || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.title}_registrations.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <button
            onClick={() => router.push("/dashboard/business")}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-4 transition-colors"
            >
              <HiArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
              <p className="text-gray-600 mt-1">{event.title}</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <HiRefresh className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <HiDownload className="h-4 w-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Event Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
                <HiUsers className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{registrations.length}</h3>
              <p className="text-sm text-gray-500">Total Registrations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
                <HiCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'registered').length}
              </h3>
              <p className="text-sm text-gray-500">Active Registrations</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
                <HiCalendar className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {registrations.filter(r => r.status === 'attended').length}
              </h3>
              <p className="text-sm text-gray-500">Attended</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full mx-auto mb-3">
                <HiClock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {event.maxAttendees - registrations.length}
              </h3>
              <p className="text-sm text-gray-500">Remaining Spots</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registration Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="registered">Registered</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Registrations ({filteredRegistrations.length})
            </h3>
          </div>

          {filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <HiUsers className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No registrations found
              </h3>
              <p className="text-gray-500">
                {registrations.length === 0 
                  ? "No one has registered for this event yet."
                  : "No registrations match the current filters."
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRegistrations.map((registration) => (
                <div key={registration._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        {registration.user.userProfileImage?.url ? (
                          <img
                            src={registration.user.userProfileImage.url}
                            alt={registration.user.fname}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-600 font-semibold text-sm">
                            {registration.user.fname?.charAt(0)}{registration.user.lname?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          {registration.user.fname} {registration.user.lname}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <HiMail className="h-4 w-4 mr-1" />
                            {registration.user.email}
                          </span>
                          <span className="flex items-center">
                            <HiCalendar className="h-4 w-4 mr-1" />
                            {formatDate(registration.registrationDate)}
                          </span>
                        </div>
                        {registration.additionalInfo && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Additional Info:</strong> {registration.additionalInfo}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(registration.status)}`}>
                        {registration.status}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(registration.paymentStatus)}`}>
                        {registration.paymentStatus}
                      </span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <HiEye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationsPage;
