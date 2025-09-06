import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { addStudent, fetchAllStudents, updateStudent, deleteStudent } from '../store/thunks';
import { voterActions } from '../store/vote-slice';
import '../styles/StudentManagement.css';

const StudentManagement = () => {
  const dispatch = useDispatch();
  const { students, loading, studentsLoading, error } = useSelector(state => state.vote);

  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    department: '',
    departmentCode: '',
    year: '',
    password: ''
  });

  useEffect(() => {
    // Clear any previous errors when component mounts
    dispatch(voterActions.clearError());
    
    // Always fetch students when component mounts (only once)
    dispatch(fetchAllStudents());
    
    // Cleanup function
    return () => {
      dispatch(voterActions.clearError());
    };
  }, [dispatch]); // Only depend on dispatch to run once on mount

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      fullName: '',
      email: '',
      department: '',
      departmentCode: '',
      year: '',
      password: ''
    });
    setEditingStudent(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        // Update student
        const { password, ...updateData } = formData;
        await dispatch(updateStudent({ 
          studentId: editingStudent._id, 
          studentData: updateData 
        })).unwrap();
        toast.success('Student updated successfully!');
      } else {
        // Add new student
        await dispatch(addStudent(formData)).unwrap();
        toast.success('Student added successfully!');
      }
      resetForm();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (student) => {
    setFormData({
      studentId: student.studentId,
      fullName: student.fullName,
      email: student.email,
      department: student.department || '',
      departmentCode: student.departmentCode || '',
      year: student.year || '',
      password: '' // Don't populate password for security
    });
    setEditingStudent(student);
    setShowForm(true);
  };

  const handleDelete = async (studentId) => {
    if (window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await dispatch(deleteStudent(studentId)).unwrap();
        toast.success('Student deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Failed to delete student');
      }
    }
  };

  const handleExportToExcel = () => {
    if (students.length === 0) {
      toast.warning('No student data available to export.');
      return;
    }

    try {
      // Use filtered students if there are active filters, otherwise use all students
      const dataToExport = searchTerm || departmentFilter ? filteredStudents : students;
      
      if (dataToExport.length === 0) {
        toast.warning('No students match the current filter criteria.');
        return;
      }

      // Prepare data for Excel export
      const exportData = dataToExport.map((student, index) => ({
        'S.No': index + 1,
        'Student ID': student.studentId || 'N/A',
        'Full Name': student.fullName || 'N/A',
        'Email': student.email || 'N/A',
        'Department': student.department || 'N/A',
        'Department Code': student.departmentCode || 'N/A',
        'Academic Year': student.year || 'N/A',
        'Registration Date': student.createdAt 
          ? new Date(student.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: '2-digit'
            })
          : 'N/A'
      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Create a worksheet from the data
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths for better formatting
      const columnWidths = [
        { wch: 6 },  // S.No
        { wch: 15 }, // Student ID
        { wch: 25 }, // Full Name
        { wch: 30 }, // Email
        { wch: 20 }, // Department
        { wch: 15 }, // Department Code
        { wch: 15 }, // Academic Year
        { wch: 18 }  // Registration Date
      ];
      worksheet['!cols'] = columnWidths;
      
      // Add header styling (bold)
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "E2E8F0" } }
          };
        }
      }
      
      // Add the worksheet to workbook
      const worksheetName = searchTerm || departmentFilter ? 'Filtered Students' : 'All Students';
      XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
      
      // Generate filename with current date and filter info
      const currentDate = new Date().toISOString().split('T')[0];
      const filterSuffix = (searchTerm || departmentFilter) ? '_filtered' : '';
      const filename = `students_export_${currentDate}${filterSuffix}.xlsx`;
      
      // Save the file
      XLSX.writeFile(workbook, filename);
      
      const exportMessage = searchTerm || departmentFilter 
        ? `Filtered Excel file exported successfully! (${dataToExport.length} of ${students.length} students)`
        : `Excel file exported successfully! (${dataToExport.length} students)`;
      
      toast.success(exportMessage);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export Excel file. Please try again.');
    }
  };

  // Filter students based on search and department
  const filteredStudents = students.filter(student => {
    const matchesSearch = !searchTerm || 
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = !departmentFilter || 
      student.department?.toLowerCase().includes(departmentFilter.toLowerCase());
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments for filter
  const uniqueDepartments = [...new Set(students.map(s => s.department).filter(Boolean))];

  return (
    <div className="student-management-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">
              <i className="fas fa-graduation-cap"></i>
              Student Management
            </h1>
            <p className="page-subtitle">
              Manage student accounts, departments, and academic information
            </p>
          </div>
          <div className="header-actions">
            <button 
              className="export-btn"
              onClick={handleExportToExcel}
              disabled={studentsLoading || students.length === 0}
              title={`Export ${searchTerm || departmentFilter ? filteredStudents.length : students.length} students to Excel`}
            >
              <i className="fas fa-file-excel"></i>
              Export Excel ({searchTerm || departmentFilter ? filteredStudents.length : students.length})
            </button>
            <button 
              className={`add-student-btn ${showForm ? 'cancel' : 'primary'}`}
              onClick={() => setShowForm(!showForm)}
            >
              <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
              {showForm ? 'Cancel' : 'Add New Student'}
            </button>
          </div>
        </div>

        {/* Add/Edit Student Form */}
        {showForm && (
          <div className="student-form-container">
            <div className="form-header">
              <h2>
                <i className={`fas ${editingStudent ? 'fa-edit' : 'fa-user-plus'}`}></i>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h2>
              <div className="form-progress">
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="student-form">
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-id-card"></i>
                    Student ID *
                  </label>
                  <input
                    type="text"
                    name="studentId"
                    className="form-input"
                    placeholder="Enter student ID"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    required
                    disabled={editingStudent !== null}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-user"></i>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    className="form-input"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-envelope"></i>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="Enter email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-building"></i>
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    className="form-input"
                    placeholder="Enter department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-code"></i>
                    Department Code
                  </label>
                  <input
                    type="text"
                    name="departmentCode"
                    className="form-input"
                    placeholder="Enter department code"
                    value={formData.departmentCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-calendar"></i>
                    Academic Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    className="form-input"
                    placeholder="Enter academic year"
                    value={formData.year}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {!editingStudent && (
                <div className="input-group password-group">
                  <label className="input-label">
                    <i className="fas fa-lock"></i>
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <small className="input-help">Minimum 6 characters</small>
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                  disabled={loading}
                >
                  <i className="fas fa-times"></i>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <i className={`fas ${loading ? 'fa-spinner fa-spin' : (editingStudent ? 'fa-save' : 'fa-plus')}`}></i>
                  {loading ? 'Processing...' : (editingStudent ? 'Update Student' : 'Add Student')}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters and Search */}
        <div className="students-filters">
          <div className="search-section">
            <div className="search-input-wrapper">
              <i className="fas fa-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search students by name, ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="filter-section">
            <select 
              className="department-filter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {uniqueDepartments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <div className="results-info">
              <span className="results-count">
                {filteredStudents.length} of {students.length} students
              </span>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="students-list">
          {error && students.length === 0 && !studentsLoading && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error.message || error}
            </div>
          )}
          
          {studentsLoading && (
            <div className="loading-state">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
              </div>
              <p>Loading students...</p>
            </div>
          )}
          
          {!studentsLoading && students.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3>No Students Found</h3>
              <p>Get started by adding your first student using the button above.</p>
            </div>
          )}

          {!studentsLoading && filteredStudents.length === 0 && students.length > 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>No Results Found</h3>
              <p>Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {!studentsLoading && filteredStudents.length > 0 && (
            <div className="students-table-container">
              <div className="table-wrapper">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th className="th-avatar">
                        <i className="fas fa-user"></i>
                      </th>
                      <th className="th-student-id">Student ID</th>
                      <th className="th-name">Full Name</th>
                      <th className="th-email">Email</th>
                      <th className="th-department">Department</th>
                      <th className="th-dept-code">Dept. Code</th>
                      <th className="th-year">Academic Year</th>
                      <th className="th-actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student, index) => (
                      <tr key={student._id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                        <td className="td-avatar">
                          <div className="student-avatar-small">
                            <i className="fas fa-user-graduate"></i>
                          </div>
                        </td>
                        <td className="td-student-id">
                          <span className="student-id-badge">{student.studentId}</span>
                        </td>
                        <td className="td-name">
                          <div className="student-name-cell">
                            <span className="name-primary">{student.fullName}</span>
                          </div>
                        </td>
                        <td className="td-email">
                          <span className="email-text">{student.email}</span>
                        </td>
                        <td className="td-department">
                          <span className="department-text">{student.department || '-'}</span>
                        </td>
                        <td className="td-dept-code">
                          <span className="dept-code-badge">{student.departmentCode || '-'}</span>
                        </td>
                        <td className="td-year">
                          <span className="year-text">{student.year || '-'}</span>
                        </td>
                        <td className="td-actions">
                          <div className="action-buttons">
                            <button
                              className="action-btn edit-btn"
                              onClick={() => handleEdit(student)}
                              title="Edit Student"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDelete(student._id)}
                              title="Delete Student"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentManagement;
