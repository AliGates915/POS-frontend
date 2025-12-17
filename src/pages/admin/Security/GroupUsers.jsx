import React, { useState, useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { toast } from "react-toastify";
import axios from "axios";
import { HashLoader } from "react-spinners";
import Swal from "sweetalert2";
import {
  FiEdit3,
  FiTrash2,
  FiUsers,
  FiUserPlus,
  FiUser,
  FiFolder,
} from "react-icons/fi";
import { FaUsers, FaUserFriends } from "react-icons/fa";
import Pagination from "../pagination/Pagination";

const GroupUsers = () => {
  const [groupUserList, setGroupUserList] = useState([]);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form states
  const [id, setId] = useState("");
  const [softwareGroupId, setSoftwareGroupId] = useState("");
  const [userId, setUserId] = useState("");

  // Dropdown data
  const [softwareGroups, setSoftwareGroups] = useState([]);
  const [users, setUsers] = useState([]);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const sliderRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Dummy data for demonstration
  const dummyGroupUsers = [
    {
      _id: "1",
      id: "GRPUSR001",
      softwareGroupId: "GRP001",
      softwareGroup: "Administrators",
      userId: "USR001",
      user: "John Doe (Admin)",
    },
    {
      _id: "2",
      id: "GRPUSR002",
      softwareGroupId: "GRP001",
      softwareGroup: "Administrators",
      userId: "USR004",
      user: "Sara Jones (Admin)",
    },
    {
      _id: "3",
      id: "GRPUSR003",
      softwareGroupId: "GRP002",
      softwareGroup: "Managers",
      userId: "USR002",
      user: "Jane Smith (Manager)",
    },
    {
      _id: "4",
      id: "GRPUSR004",
      softwareGroupId: "GRP002",
      softwareGroup: "Managers",
      userId: "USR005",
      user: "Alex Chen (Manager)",
    },
    {
      _id: "5",
      id: "GRPUSR005",
      softwareGroupId: "GRP003",
      softwareGroup: "Regular Users",
      userId: "USR003",
      user: "Mike Wilson (User)",
    },
    {
      _id: "6",
      id: "GRPUSR006",
      softwareGroupId: "GRP003",
      softwareGroup: "Regular Users",
      userId: "USR006",
      user: "Lisa Wong (User)",
    },
    {
      _id: "7",
      id: "GRPUSR007",
      softwareGroupId: "GRP004",
      softwareGroup: "IT Department",
      userId: "USR007",
      user: "David Kim (Admin)",
    },
    {
      _id: "8",
      id: "GRPUSR008",
      softwareGroupId: "GRP004",
      softwareGroup: "IT Department",
      userId: "USR008",
      user: "Emma Taylor (User)",
    },
    {
      _id: "9",
      id: "GRPUSR009",
      softwareGroupId: "GRP005",
      softwareGroup: "Finance Team",
      userId: "USR004",
      user: "Sara Jones (Admin)",
    },
    {
      _id: "10",
      id: "GRPUSR010",
      softwareGroupId: "GRP006",
      softwareGroup: "Sales Team",
      userId: "USR005",
      user: "Alex Chen (Manager)",
    },
  ];

  // Dummy software groups
  const dummySoftwareGroups = [
    { id: "GRP001", name: "Administrators" },
    { id: "GRP002", name: "Managers" },
    { id: "GRP003", name: "Regular Users" },
    { id: "GRP004", name: "IT Department" },
    { id: "GRP005", name: "Finance Team" },
    { id: "GRP006", name: "Sales Team" },
    { id: "GRP007", name: "Marketing Team" },
    { id: "GRP008", name: "Customer Support" },
  ];

  // Dummy users
  const dummyUsers = [
    {
      id: "USR001",
      name: "John Doe",
      role: "Admin",
      fullName: "John Doe (Admin)",
    },
    {
      id: "USR002",
      name: "Jane Smith",
      role: "Manager",
      fullName: "Jane Smith (Manager)",
    },
    {
      id: "USR003",
      name: "Mike Wilson",
      role: "User",
      fullName: "Mike Wilson (User)",
    },
    {
      id: "USR004",
      name: "Sara Jones",
      role: "Admin",
      fullName: "Sara Jones (Admin)",
    },
    {
      id: "USR005",
      name: "Alex Chen",
      role: "Manager",
      fullName: "Alex Chen (Manager)",
    },
    {
      id: "USR006",
      name: "Lisa Wong",
      role: "User",
      fullName: "Lisa Wong (User)",
    },
    {
      id: "USR007",
      name: "David Kim",
      role: "Admin",
      fullName: "David Kim (Admin)",
    },
    {
      id: "USR008",
      name: "Emma Taylor",
      role: "User",
      fullName: "Emma Taylor (User)",
    },
  ];

  // Function to generate the next assignment ID
  const generateNextAssignmentId = () => {
    if (groupUserList.length === 0) {
      return "GRPUSR001";
    }

    // Extract all numeric parts from existing IDs
    const existingIds = groupUserList
      .map((item) => item.id)
      .filter((id) => id && id.startsWith("GRPUSR"))
      .map((id) => {
        const match = id.match(/GRPUSR(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => !isNaN(num));

    if (existingIds.length === 0) {
      return "GRPUSR001";
    }

    // Find the highest number
    const maxId = Math.max(...existingIds);

    // Generate next ID with leading zeros
    const nextIdNum = maxId + 1;
    const nextId = `GRPUSR${nextIdNum.toString().padStart(3, "0")}`;

    return nextId;
  };

  // Slider animation
  useEffect(() => {
    if (isSliderOpen && sliderRef.current) {
      gsap.fromTo(
        sliderRef.current,
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [isSliderOpen]);

  // Fetch group users
  const fetchGroupUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API first
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/group-users`
      );
      if (res.data && res.data.length > 0) {
        setGroupUserList(res.data);
      } else {
        // If no data from API, use dummy data
        setGroupUserList(dummyGroupUsers);
        setSoftwareGroups(dummySoftwareGroups);
        setUsers(dummyUsers);
        console.log("Using dummy group users data");
      }
    } catch (error) {
      // If API fails, use dummy data for demonstration
      console.log("API failed, using dummy data");
      setGroupUserList(dummyGroupUsers);
      setSoftwareGroups(dummySoftwareGroups);
      setUsers(dummyUsers);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  }, []);

  useEffect(() => {
    fetchGroupUsers();
  }, [fetchGroupUsers]);

  const totalItems = groupUserList.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = groupUserList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handlers
  const handleAddGroupUser = () => {
    setIsSliderOpen(true);
    setIsEdit(false);
    setEditId(null);

    // Auto-generate the next ID
    const nextId = generateNextAssignmentId();
    setId(nextId);

    setSoftwareGroupId("");
    setUserId("");
  };

  // Get software group name by ID
  const getSoftwareGroupName = (groupId) => {
    const group = softwareGroups.find((g) => g.id === groupId);
    return group ? group.name : "Unknown Group";
  };

  // Get user name by ID
  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.fullName : "Unknown User";
  };

  // Save or Update Group User
  const handleSave = async () => {
    if (!softwareGroupId || !userId) {
      toast.error("Software Group and User are required");
      return;
    }

    // Check if this user is already in the group
    const existingAssignment = groupUserList.find(
      (item) =>
        item.softwareGroupId === softwareGroupId && item.userId === userId
    );

    if (existingAssignment && (!isEdit || existingAssignment._id !== editId)) {
      toast.error("This user is already assigned to this group");
      return;
    }

    const formData = new FormData();
    formData.append("id", id);
    formData.append("softwareGroupId", softwareGroupId);
    formData.append("userId", userId);

    console.log("Form Data", [...formData.entries()]);

    try {
      const headers = {
        Authorization: `Bearer ${userInfo?.token || "dummy-token"}`,
        "Content-Type": "multipart/form-data",
      };

      if (isEdit && editId) {
        // For dummy data, update locally
        const softwareGroupName = getSoftwareGroupName(softwareGroupId);
        const userName = getUserName(userId);

        const updatedGroupUser = {
          _id: editId,
          id: id || `GRPUSR${Date.now().toString().slice(-6)}`,
          softwareGroupId,
          softwareGroup: softwareGroupName,
          userId,
          user: userName,
        };

        setGroupUserList(
          groupUserList.map((item) =>
            item._id === editId ? updatedGroupUser : item
          )
        );
        toast.success("Group user updated successfully");
      } else {
        // For dummy data, add new group user locally
        const softwareGroupName = getSoftwareGroupName(softwareGroupId);
        const userName = getUserName(userId);

        const newGroupUser = {
          _id: `group-user-${Date.now()}`,
          id: id || `GRPUSR${Date.now().toString().slice(-6)}`,
          softwareGroupId,
          softwareGroup: softwareGroupName,
          userId,
          user: userName,
        };

        setGroupUserList([newGroupUser, ...groupUserList]);
        toast.success("Group user added successfully");
      }

      reState();
    } catch (error) {
      console.error(error);
      toast.error(`❌ ${isEdit ? "Update" : "Add"} Group User failed`);
    }
  };

  // Edit Group User
  const handleEdit = (groupUser) => {
    setIsEdit(true);
    setEditId(groupUser._id);
    setId(groupUser.id || "");
    setSoftwareGroupId(groupUser.softwareGroupId || "");
    setUserId(groupUser.userId || "");
    setIsSliderOpen(true);
  };

  // Delete Group User
  const handleDelete = async (id) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        actions: "space-x-2",
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // For dummy data, delete locally
            setGroupUserList(groupUserList.filter((item) => item._id !== id));
            swalWithTailwindButtons.fire(
              "Deleted!",
              "Group user deleted successfully.",
              "success"
            );
          } catch (error) {
            console.error("Delete error:", error);
            swalWithTailwindButtons.fire(
              "Error!",
              "Failed to delete group user.",
              "error"
            );
          }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithTailwindButtons.fire(
            "Cancelled",
            "Group user is safe 🙂",
            "error"
          );
        }
      });
  };

  // Reset state
  const reState = () => {
    setIsSliderOpen(false);
    setIsEdit(false);
    setEditId(null);
    setId("");
    setSoftwareGroupId("");
    setUserId("");
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <HashLoader height="150" width="150" radius={1} color="#84CF16" />
          <p className="mt-4 text-gray-600">Loading group users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <FaUserFriends className="text-newPrimary w-8 h-8" />
          <div>
            <h1 className="text-2xl font-bold text-newPrimary">Group Users</h1>
            <p className="text-gray-500 text-sm">
              Manage user assignments to software groups
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            className="bg-newPrimary text-white px-4 py-2 rounded-lg hover:bg-newPrimary/80 transition-colors flex items-center gap-2"
            onClick={handleAddGroupUser}
          >
            <FiUserPlus className="w-4 h-4" />
            Assign User to Group
          </button>
        </div>
      </div>

      {/* Group Users Table */}
      <div className="rounded-xl shadow-lg p-6 border border-gray-200 w-full overflow-hidden bg-white">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="min-w-[800px]">
            {/* Table Headers */}
            <div className="grid grid-cols-[0.5fr_2fr_2fr_0.8fr] gap-4 bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 rounded-t-lg">
              <div>Sr#</div>
              <div>Software Group</div>
              <div>User</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Group Users List */}
            <div className="flex flex-col">
              {currentItems.map((item, index) => (
                <div
                  key={item._id}
                  className={`grid grid-cols-[0.5fr_2fr_2fr_0.8fr] items-center gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                  }`}
                >
                  {/* Serial Number */}
                  <div className="text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </div>

                  {/* Software Group */}
                  <div>
                    <div className="flex items-center gap-2">
                      <FiFolder className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {item.softwareGroup}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User */}
                  <div>
                    <div className="flex items-center gap-2">
                      <FiUser className="w-4 h-4 text-green-500" />
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {item.user}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 justify-end">
                    {/* EDIT ICON */}
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-purple-600 hover:bg-purple-100 bg-purple-50 p-2 rounded-md transition"
                      title="Edit Assignment"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>

                    {/* DELETE ICON */}
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:bg-red-100 bg-red-50 p-2 rounded-md transition"
                      title="Remove from Group"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          compact={true}
        />
      </div>

      {/* Slider/Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 transition-all duration-300 ${
          isSliderOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-600/70 backdrop-blur-0 transition-opacity duration-300 ${
            isSliderOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={reState}
        />

        {/* Slider Content */}
        <div
          ref={sliderRef}
          className={`relative bg-white w-full max-w-xl rounded-3xl shadow-2xl transform transition-all duration-500 ease-out ${
            isSliderOpen ? "translate-y-0 scale-100" : "translate-y-8 scale-95"
          }`}
        >
          {/* Header with gradient */}
          <div className="sticky top-0 z-10 bg-gray-200 px-8 py-4 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                    <FiUsers className="w-6 h-6 text-newPrimary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-newPrimary">
                      {isEdit ? "Update Group User" : "Assign User to Group"}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit
                        ? "Update user group assignment"
                        : "Select group and user to assign"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="p-1 hover:bg-white/20 bg-white/10 rounded-xl transition-all duration-300 group backdrop-blur-sm hover:scale-105"
                onClick={reState}
              >
                <svg
                  className="w-6 h-6 text-white bg-newPrimary rounded-lg group-hover:rotate-90 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="px-8 py-6 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-hide scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="space-y-8 pb-2">
              {/* Form Section */}
              <div className="space-y-6 p-6 border border-gray-300/60 rounded-2xl bg-gray-100/40 shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-2 border-b border-gray-300 pb-2">
                  <div className="w-1.5 h-6 bg-newPrimary rounded-full"></div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Group Assignment
                  </h3>
                </div>

                <div className="space-y-6">
                  {/* ID Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      Group ID
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                      <input
                        type="text"
                        value={id}
                        readOnly
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl bg-white cursor-not-allowed transition-all duration-200"
                        placeholder="Auto-generated ID"
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      ID is automatically generated
                    </p>
                  </div>

                  {/* Software Group Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      Software Group{" "}
                      <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <FiFolder className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={softwareGroupId}
                        onChange={(e) => setSoftwareGroupId(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select Software Group</option>
                        {softwareGroups.map((group) => (
                          <option key={group.id} value={group.id}>
                            {group.name} ({group.id})
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* User Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                      User <span className="text-red-500 text-lg">*</span>
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-newPrimary/30 focus:border-newPrimary bg-white transition-all duration-200 hover:border-gray-400 appearance-none"
                      >
                        <option value="">Select User</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.fullName}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-4">
                <button
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-newPrimary to-newPrimary/90 text-white font-semibold rounded-xl hover:from-newPrimary/90 hover:to-newPrimary transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  onClick={handleSave}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isEdit ? (
                      <>
                        <FiEdit3 className="w-5 h-5" />
                        Update Assignment
                      </>
                    ) : (
                      <>
                        <FiUserPlus className="w-5 h-5" />
                        Assign User to Group
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupUsers;
