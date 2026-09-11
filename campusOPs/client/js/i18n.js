/**
 * CampusOps Centralized Internationalization (i18n) Engine
 * Supports English ('en') and Marathi ('mr')
 */

const translations = {
  en: {
    appName: "CampusOps",
    chooseLanguage: "Choose Language / भाषा निवडा",
    selectLanguageDesc: "Select your preferred language to continue to CampusOps",
    english: "English",
    marathi: "मराठी",
    continue: "Continue",
    tagline: "Autonomous Facility & Academic Operations Hub",
    activePersona: "Active Persona",
    
    roles: {
      student: "Student Desk",
      faculty: "Faculty Desk",
      facility: "Facility Crew",
      admin: "Estate Admin",
      studentSub: "01 • Student Desk",
      facultySub: "02 • Faculty Desk",
      facilitySub: "03 • Facility Crew",
      adminSub: "04 • Estate Office"
    },

    roleDescriptions: {
      student: "Submit geo-tagged breakdown reports, track repair velocity, and view campus-wide notice feeds.",
      faculty: "Endorse classroom hazards, fast-track high-priority fixes, and schedule equipment inspections.",
      facility: "View assigned maintenance tickets, verify safety LOTO protocols, and submit proof of completion.",
      admin: "Dispatch outside contractors, track real-time technician attendance, and analyze campus breakdown hotspots."
    },

    auth: {
      studentTitle: "Student Access",
      studentSubtitle: "Sign in to report facility problems and track live repair progress.",
      facultyTitle: "Faculty Access",
      facultySubtitle: "Fast-track academic issues and endorse campus repairs.",
      facilityTitle: "Facility Crew Access",
      facilitySubtitle: "Access your on-duty work order queue and safety checklists.",
      adminTitle: "Estate Office Access",
      adminSubtitle: "Campus-wide infrastructure governance and vendor authorization.",
      rollNumber: "Roll Number / Student ID",
      rollNumberPlaceholder: "e.g., CS2024-042",
      mobileNumber: "Mobile Number",
      mobileNumberPlaceholder: "10-digit registered number",
      email: "Institutional Email",
      emailPlaceholder: "prof.name@college.edu",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      accessKey: "Access Key",
      accessKeyPlaceholder: "Enter your faculty access key",
      staffId: "Staff ID / Badge No.",
      staffIdPlaceholder: "e.g., FAC-882",
      pin: "Security PIN",
      pinPlaceholder: "4-digit shift PIN",
      adminUsername: "Admin Username",
      adminUsernamePlaceholder: "e.g., admin.estate",
      signInStudent: "Sign In to Student Portal",
      signInFaculty: "Sign In to Faculty Portal",
      signInFacility: "Sign In to Crew Desk",
      signInAdmin: "Sign In to Admin Portal",
      quickDemo: "Quick Demo Login",
      rememberMe: "Remember this device for 30 days",
      forgotDetails: "Forgot login details?",
      contactEstate: "Contact Estate Helpdesk",
      signingIn: "Signing In..."
    },

    nav: {
      dashboard: "Dashboard",
      reportProblem: "Report a Problem",
      myTickets: "My Tickets",
      allIssues: "All Campus Issues",
      myIssues: "My Reported Issues",
      notices: "Broadcast Notices",
      scanQr: "Scan Room QR",
      signOut: "Sign Out",
      notifications: "Notifications",
      activeIncidents: "Active Incidents",
      vendorApprovals: "Vendor Approvals",
      rosterShift: "Roster & AI Auto-Shift",
      breakdownRadar: "Breakdown Radar"
    },

    categories: {
      electrical: "Electrical & Lighting",
      projector: "Projector & Audio/Visual",
      plumbing: "Plumbing & Water Supply",
      hvac: "Air Conditioning & HVAC",
      furniture: "Desk & Classroom Furniture",
      housekeeping: "Sanitation & Housekeeping"
    },

    student: {
      hubTitle: "Student Incident Hub & Notice Board",
      hubBadge: "Student Hub",
      hubSubtitle: "Student Facility Reporting & Live Tracking Portal",
      aiTriageStatus: "AI Triage Dispatch Active",
      campusNoticeBoard: "Campus Notice Board",
      noticeBoardDesc: "Official estate office bulletins & AI-driven autonomous facility updates",
      allFeed: "All Feed",
      adminBulletins: "Admin Bulletins",
      aiReports: "AI Reports & Insights",
      scanQrTag: "Scan QR Tag",
      recommendedReports: "Recommended Reports",
      recommendedSub: "Check and upvote duplicate issues before filing a new ticket",
      reportModalTitle: "Report Campus Facility Issue",
      categoryLabel: "Category *",
      locationLabel: "Classroom / Location *",
      locationPlaceholder: "e.g. Block C • Room 302 or scan QR",
      descriptionLabel: "Problem Description *",
      descPlaceholder: "Provide clear keywords (e.g. switchboard spark, loose wire, fan noise)...",
      photoProofLabel: "Photo / Visual Proof",
      photoHint: "Helps AI Triage & Workers",
      takePhotoCamera: "Take Photo with Camera",
      uploadLaptop: "Upload from Laptop",
      submitForTriage: "Submit Ticket for Triage",
      matchingReport: "Matching Report",
      matchingReports: "Matching Reports",
      initialProofPhoto: "Initial Proof Photo",
      afterRepairProof: "After Repair Resolution Proof",
      upvotes: "Upvotes",
      location: "Location",
      cameraLive: "LAPTOP CAMERA LIVE",
      snapPhoto: "Snap Photo",
      cancel: "Cancel",
      photoAttached: "Photo Attached (Will be saved to DB)",
      ready: "Ready",
      attachedProofPreview: "Attached Proof Preview",
      fullscreen: "Fullscreen",
      retakeChange: "Retake / Change",
      remove: "Remove",
      scanLocationQr: "Scan Location QR",
      pointCameraQr: "Point your camera at the room QR code",
      photoEvidence: "Photo Evidence",
      storedSecurely: "Stored securely in Supabase DB",
      close: "Close",
      telemetry: "Live Campus Operational Telemetry & Community Upvoting",
      verifiedFeed: "Verified Campus Notice Feed",
      officialNotices: "Official institutional alerts and emergency announcements",
      searchPlaceholder: "Filter by classroom, lab, or issue keyword...",
      reportIssueBtn: "Report Issue",
      activeReports: "Active Reports",
      noDuplicateFound: "No duplicate reports found",
      noDuplicateDesc: "No one has reported an issue matching this query yet. You can be the first to report it!",
      reportThisIssueNow: "Report This Issue Now",
      noActiveTickets: "No active tickets at this time.",
      similarIssuesFound: "Similar issues already reported!",
      rankedBySimilarity: "Ranked by Similarity",
      upvoteExistingDesc: "Tap Upvote on an existing report below to increase its urgency without filing a duplicate ticket:",
      topMatch: "Top Match",
      mostSimilar: "Most Similar Issue",
      keywordMatch: "Keyword Match",
      matchedKeywords: "Matched keywords:"
    },

    reportModal: {
      title: "Report Campus Issue",
      subtitle: "Direct link to ground maintenance crew",
      locationLabel: "Classroom / Lab Location *",
      locationPlaceholder: "e.g. Block C - Room 301, Lab 2",
      issueTitleLabel: "Issue Title *",
      issueTitlePlaceholder: "e.g. Switchboard short circuit, water leakage",
      categoryLabel: "Issue Category *",
      categoryPlaceholder: "Select category",
      categories: {
        electrical: "Electrical (Wiring, Sockets, Lights)",
        plumbing: "Plumbing (Taps, Pipes, Washrooms)",
        hvac: "HVAC (AC, Fans, Ventilation)",
        carpentry: "Carpentry (Benches, Doors, Windows)",
        it: "IT & Projector (AV, Wi-Fi, Screens)",
        civil: "Civil & Cleanliness (Flooring, Painting)"
      },
      descriptionLabel: "Detailed Description *",
      descriptionPlaceholder: "Please describe the problem clearly...",
      photoEvidence: "Photo Evidence (Optional)",
      uploadPhoto: "Upload from device",
      takePhoto: "Take Photo with Camera",
      cameraActive: "Camera Active - Center the issue in frame",
      capture: "Capture Photo",
      cancelCamera: "Cancel Camera",
      photoAttached: "Photo attached successfully",
      submitReport: "Submit Report",
      submitting: "Submitting...",
      cancel: "Cancel"
    },

    ticket: {
      ticketId: "Ticket",
      telemetryHeader: "Live Telemetry, Evidence & Audit Timeline",
      generalIssue: "General Issue",
      location: "Location:",
      reportedBy: "Reported by:",
      subtitle: "Live Telemetry, Evidence & Audit Timeline",
      locationLabel: "Location:",
      reported: "Reported:",
      verifiedSubmission: "Verified Submission",
      initialVisualProof: "Initial Visual Proof Uploaded by Reporter",
      resolutionProof: "After Repair Resolution Proof",
      beforeRepair: "Before Repair (Reported)",
      afterRepair: "After Repair (Resolved Proof)",
      viewHighRes: "View High-Res Image",
      storedInDb: "Stored in DB",
      noPhotoAttached: "No photo was attached with this report.",
      technicianNotes: "Technician Resolution Notes",
      operationalTimeline: "Live Operational Timeline",
      timelineSubtitle: "Autonomous audit trail from report to final verification",
      step1Title: "Reported & AI Triaged",
      step1Desc: "Assigned automatically based on categorization",
      step2Title: "Repair In Progress & Safety Isolated",
      step2Desc: "Technician working on-site",
      step3Title: "Proof of Work Submitted & Closed",
      step3Desc: "Issue successfully resolved and verified",
      satisfactionFeedback: "Satisfaction Feedback",
      rateRepair: "Rate the repair quality once resolution proof is verified by the campus team:",
      submitReview: "Submit Review",
      availableAfterResolution: "Available after resolution",
      feedbackSubmitted: "Feedback Submitted",
      submittingReview: "Submitting...",
      upvote: "Upvote",
      share: "Share",
      highPriority: "High Priority",
      urgentSla: "Urgent SLA",
      facultyEndorsed: "Faculty Endorsed",
      statuses: {
        open: "Open",
        inProgress: "In Progress",
        resolved: "Resolved",
        escrowApproved: "Escrow Approved"
      }
    },

    teacher: {
      hubTitle: "Faculty Desk & Priority Escalation",
      subtitle: "Fast-track academic issues and endorse classroom repairs",
      classInSession: "Class in session? Fast-track classroom repairs instantly",
      endorseTicket: "Endorse Ticket",
      endorsed: "Endorsed",
      verifiedFaculty: "Verified Faculty Submission",
      slaFastTrack: "Academic SLA Fast-Track Active",
      academicNotices: "Campus & Academic Notices",
      noticesDesc: "Estate office bulletins, faculty advisories & AI autonomous telemetry",
      reportAcademicIssue: "Report Academic Issue Now",
      submitAcademicTicket: "Submit Academic Ticket",
      scanClassroomQr: "Scan Classroom QR",
      pointCameraClassroom: "Point camera at classroom or equipment QR",
      classInSessionTitle: "⚡ Class Currently in Session / Ongoing Lecture",
      classInSessionDesc: "Dispatches with highest urgency, boosts priority score to 95+, and flags duty desk for immediate resolution.",
      cameraLive: "FACULTY CAMERA LIVE",
      searchPlaceholder: "Search campus issues to endorse or inspect (e.g. Projector, AC, Lab 402, Block C)...",
      activeClassroomHazards: "Academic & Campus Incident Feed",
      hazardsDesc: "Faculty endorsement instantly triggers Priority SLA Escalation for technician dispatch",
      endorseModalTitle: "Report Academic / Classroom Issue",
      priorityLabel: "Priority",
      endorsedByFaculty: "Endorsed by Faculty",
      endorseAction: "Endorse Issue"
    },

    facility: {
      deskTitle: "Facility Dispatch & Technician Desk",
      controlDesk: "Technician Control Desk",
      subtitle: "Active Work Order Queue & On-Site Repair Engine",
      controlSub: "Departmental Incident Resolution, Safety LOTO & Visual Proof Verification",
      shiftActive: "On-Duty Shift Active • Real-Time DB Sync",
      myTradeTasks: "My Trade Tasks",
      urgentSla: "Urgent SLA / Class",
      inProgressKpi: "In Progress",
      resolvedVerified: "Resolved & Verified",
      deptQueueTitle: "Departmental Workload & Incident Queue",
      deptQueueSub: "Filter by technician specialty or view all campus reports",
      myTradePrefix: "My Trade:",
      allCampus: "All Campus Reports",
      allTrades: "All Trades",
      electrical: "Electrical",
      plumbing: "Plumbing",
      hvac: "HVAC",
      carpentry: "Civil / Furniture",
      it: "IT A/V",
      civil: "Civil",
      allActive: "All Active",
      unassigned: "Unassigned",
      inProgress: "In Progress",
      completed: "Completed",
      searchTasksPlaceholder: "Search by classroom (e.g. Lab 402), ticket ID, or issue keyword...",
      scanAreaQr: "Scan Area QR",
      showingFiltered: "Showing work orders filtered to:",
      clearFilter: "Clear Location Filter",
      assignedQueue: "Assigned Task Queue",
      assignedQueueSub: "Accept orders, verify safety checklist, and submit resolution visual proof",
      acceptTask: "Accept Task",
      safetyChecklist: "Safety Checklist",
      lotoVerified: "✓ Safety LOTO Verified",
      markResolved: "Mark Resolved (Proof)",
      verifiedBy: "Verified & Resolved by:",
      classInSession: "Class in Session",
      takePhotoCamera: "Take Photo with Camera",
      uploadLaptop: "Upload from Laptop",
      snapPhoto: "Snap Resolution Photo",
      photoReady: "After-Repair Photo Ready",
      retake: "Retake",
      remove: "Remove",
      requestVendor: "Request External Vendor",
      tasksInQueue: "Tasks in Queue",
      noActiveOrders: "No active work orders",
      noActiveOrdersSub: "There are no tasks matching the selected department trade and filters.",
      ppe: "1. Personal Protective Equipment (PPE)",
      ppeDesc: "Insulated gloves, safety goggles/face shield, and dielectric boots deployed.",
      loto: "2. Lockout / Tagout (LOTO) Verified",
      lotoDesc: "Upstream circuit breaker or isolation valve turned off, locked with safety padlock, and tagged.",
      barricade: "3. Work Zone Hazard Barricaded",
      barricadeDesc: "Warning signage posted, cones positioned, students alerted away from hazard zone.",
      saveSafety: "Save Safety Clearance & Authorize Repair",
      resolveTicket: "Mark as Resolved & Upload Proof",
      uploadResolutionProof: "Upload After-Repair Proof Photo *",
      resolutionNotesPlaceholder: "Detail what was repaired, replaced parts, safety restored...",
      confirmResolution: "Confirm Resolution & Sync Database"
    },

    admin: {
      deskTitle: "Estate Office Desk",
      subtitle: "Central Facility Dispatch, Vendor Approval & Shift Governance",
      postNotice: "Post Broadcast Notice",
      requiresSignOff: "Requires Sign-Off",
      liveIncidents: "Live Incidents",
      groundWorkforce: "Ground Workforce",
      recurringRadar: "Recurring Radar",
      vendorApprovals: "Vendor Approvals",
      pendingContractorTitle: "Pending Outside Contractor Approvals",
      pendingContractorSub: "Technicians inspected these issues and verified outside machinery/tools are needed",
      activeIncidentQueue: "Active Incident Queue",
      activeTicketsTitle: "Campus Active Tickets",
      activeTicketsSub: "Full visibility into all classroom, lab, and corridor complaints",
      filterAdminPlaceholder: "Filter by room, category, or ticket ID...",
      rosterAI: "Roster & AI Auto-Shift",
      hotspots: "Campus Breakdown Hotspots",
      tableTicket: "Ticket",
      tableLocation: "Location",
      tableProblem: "Problem",
      tableUpvotes: "Upvotes / Endorse",
      tableCrew: "Assigned Crew",
      tableAction: "Action",
      manage: "Manage",
      rosterTitle: "Ground Workforce & Attendance Engine",
      rosterSub: "When a technician marks absent, the AI triage redistributes their orders to on-duty staff",
      radarTitle: "Campus Breakdown Radar & Root Causes",
      approvePo: "Approve PO & Issue Gate Pass",
      completeWork: "Complete Work & Invoice",
      reassignTask: "Reassign Task",
      triggerSync: "Trigger Auto-Sync Check",
      publishNotice: "Publish Campus Notice",
      noticeType: "Notice Type *",
      noticeHeadline: "Headline *",
      noticeLocation: "Affected Room / Block *",
      noticeInstructions: "Instructions for Students & Faculty *",
      broadcastNotice: "Broadcast Notice to All Portals",
      reassignTech: "Re-assign Tech",
      noIncidents: "No active incidents",
      noPendingVendors: "No pending vendor approvals.",
      locAndMachine: "Location & Machine",
      assignedTo: "Assigned to:",
      description: "Description:",
      contractStatus: "Contract Status:",
      underActiveAmc: "Under Active AMC",
      outOfWarranty: "Out of Warranty (Requires Direct Purchase)",
      estimatedCost: "Estimated Cost:",
      coveredByAmc: "₹0 (Covered by AMC)",
      requiresQuote: "Requires Quote",
      assignedVendorOem: "Assigned Vendor / OEM",
      radarSub: "System highlights repeated breakages so the estate office can order complete rewiring/replacement",
      liveSpatial: "Live Spatial Hotspots",
      mttrTrends: "MTTR & Failure Trends",
      noticeSub: "Appears immediately on Student and Faculty notice banners",
      chooseStaff: "Choose New Staff Member *",
      reassignReason: "Reason for Re-assignment *",
      confirmPush: "Confirm & Push to Technician Phone",
      totalCost: "Total Cost / Money Required (₹) *",
      workDoneDetails: "Problem / Work Done Details *",
      saveResolved: "Save Details & Mark Resolved",
      adjustLoad: "Adjust Task Load",
      currentLoad: "Current Load:"
    },

    qr: {
      title: "CampusOps QR Resolver",
      subtitle: "Smart Classroom & Equipment Tag Verification",
      recognized: "QR Tag Recognized",
      selectRole: "Select Your Portal Role to Route:",
      studentRoute: "I am a Student (Report Issue Here)",
      facultyRoute: "I am Faculty (Endorse / Fast-Track Issue)",
      workerRoute: "I am Maintenance Worker (View Room Tasks)",
      scanRoomQr: "Scan Classroom / Lab QR",
      cameraInstructions: "Scan classroom tag to filter on-site work orders",
      zoneMapped: "Main switchboard panel & projector feed mapped to this physical zone."
    },

    common: {
      success: "Success",
      error: "Error",
      info: "Info",
      close: "Close",
      loading: "Loading...",
      viewImage: "View High-Res Image",
      copied: "Copied to clipboard!",
      actionCompleted: "Action completed successfully."
    },

    login: {
      activePersona: "Active Persona",
      studentSubtitle: "Learner & Issue Reporter",
      facultySubtitle: "Academic Authority",
      facilitySubtitle: "Maintenance Crew",
      adminSubtitle: "Chief Operations Officer",
      signInTab: "Sign In",
      registerTab: "Register",
      rememberTerminal: "Remember this terminal",
      safeKey: "SafeKey",
      autoFillDemo: "⚡ Auto-Fill Demo",
      studentBadge: "01 • Student Desk",
      studentLoginTitle: "Student Gateway",
      studentLoginSub: "Sign in with PRN / Roll Number or college email to access campus reporting.",
      studentSignupTitle: "Student Account Registration",
      studentSignupSub: "Register your student credentials to log issues and track progress.",
      loginAction: "ACCESS STUDENT HUB →",
      signupAction: "CREATE STUDENT ACCOUNT →",
      studentLoginAction: "ACCESS STUDENT HUB →",
      studentSignupAction: "CREATE STUDENT ACCOUNT →",
      teacherBadge: "02 • Faculty Authority",
      teacherLoginTitle: "Faculty Academic Desk",
      teacherLoginSub: "Sign in with Faculty Employee ID to endorse urgent lecture issues.",
      teacherSignupTitle: "Faculty Account Registration",
      teacherSignupSub: "Register your academic profile with departmental information.",
      teacherLoginAction: "ACCESS FACULTY DESK →",
      teacherSignupAction: "CREATE FACULTY ACCOUNT →",
      workerBadge: "03 • Operations Crew",
      workerLoginTitle: "Maintenance & Facility Desk",
      workerLoginSub: "Sign in with Staff Worker ID or Phone to view prioritized repair tasks.",
      workerSignupTitle: "Facility Crew Registration",
      workerSignupSub: "Register your trade expertise and duty shift roster.",
      workerLoginAction: "ACCESS FACILITY DESK →",
      workerSignupAction: "REGISTER MAINTENANCE WORKER →",
      adminBadge: "04 • Estate Office",
      adminLoginTitle: "Estate Admin Console",
      adminLoginSub: "Sign in with Master Estate Credentials for autonomous facility governance & vendor approval.",
      adminSignupTitle: "Admin Access Request",
      adminSignupSub: "Submit supervisor credentials for administrative authorization.",
      adminLoginAction: "ACCESS ESTATE ADMIN CONSOLE →",
      adminSignupAction: "REQUEST ADMIN ACCESS →",
      prnOrEmail: "PRN / Roll Number or College Email *",
      password: "Password *",
      forgotPassword: "Forgot Password?",
      facultyIdOrEmail: "Faculty Employee ID or Official Email *",
      academicDepartment: "Academic Department *",
      institutionalPassword: "Institutional Password *",
      keepSession: "Keep Faculty Session Active",
      executivePriority: "Executive SLA Priority",
      workerIdOrPhone: "Staff / Worker ID or Mobile No. *",
      assignedCategory: "Assigned Category *",
      primaryShift: "Primary Duty Shift *",
      passwordPin: "Password / Pin *",
      offlineActive: "Offline Auto-Sync Cache Active",
      estateIdOrEmail: "Estate Officer ID or Master Email *",
      adminClearance: "Administrative Clearance Level *",
      masterPassword: "Master Security Password *",
      tokenRequired: "2FA Token Required",
      fullName: "Full Legal Name *",
      mobileNumber: "Mobile Number (SMS Alerts) *",
      officialEmail: "Official Institutional Email *",
      confirmPassword: "Confirm Password *",
      triageEngine: "Triage Engine",
      masterGovernanceDesc: "Master Governance: Full vendor PO approval & AI roster override active.",
      quickFillDemo: "⚡ Quick Fill Demo",
      confirmRecords: "I confirm my details correspond with the official campus records.",
      useSso: "Use SSO?",
      supervisorPin: "Supervisor PIN?",
      studentPrn: "Student PRN / Roll Number *",
      departmentBranch: "Department / Branch *",
      academicYear: "Academic Year *",
      divisionSection: "Division / Section *",
      facultyId: "Faculty Employee ID *",
      designation: "Designation *",
      cabinNo: "Cabin / Room No *",
      workerId: "Staff Worker ID *",
      supervisorExt: "Supervisor Extension *",
      createPassword: "Create Password *",
      departments: {
        cs: "Department of Computer Science & Engineering",
        it: "Department of Information Technology",
        mech: "Department of Mechanical Engineering",
        civil: "Department of Civil Engineering",
        ee: "Department of Electrical & Electronics"
      },
      trades: {
        electrical: "Electrical Maintenance & Power",
        plumbing: "Plumbing & Water Supply",
        hvac: "HVAC & Lab Systems",
        sanitation: "Sanitation & Waste",
        carpentry: "Carpentry & Furniture",
        it: "IT & Network Infrastructure"
      },
      shifts: {
        morning: "Morning (07:00 - 15:00)",
        general: "General Day (09:00 - 17:00)",
        evening: "Evening (14:00 - 22:00)",
        night: "Night Duty (22:00 - 06:00)"
      },
      clearanceLevels: {
        chief: "Chief Estate & Operations Officer",
        senior: "Senior Campus Maintenance Supervisor",
        vendor: "Institutional Purchase & Vendor Controller"
      },
      designations: {
        asstProf: "Assistant Professor",
        assocProf: "Associate Professor",
        hod: "Head of Department (HOD)",
        labInCharge: "Lab In-charge"
      },
      years: {
        y1: "Year 1 (Sem 1–2)",
        y2: "Year 2 (Sem 3–4)",
        y3: "Year 3 (Sem 5–6)",
        y4: "Year 4 (Sem 7–8)"
      },
      placeholders: {
        studentIdentifier: "e.g. 2024CS1092 or roll.no@campus.edu",
        facultyIdentifier: "e.g. FAC-3042 or prof.sharma@campus.edu",
        workerIdentifier: "e.g. WRK-504 or +919823045129",
        adminIdentifier: "e.g. ADMIN-01 or estate.office@campus.edu",
        password: "••••••••••••",
        fullName: "e.g. Aditi Sharma",
        phone: "e.g. +91 98230 45129",
        email: "name@campus.edu",
        studentPrn: "e.g. 2024CS1092",
        division: "e.g. Div B – Batch B2",
        facultyId: "e.g. EMP-3042",
        cabinNo: "e.g. Block B - Room 304",
        workerId: "e.g. WRK-504",
        supervisorExt: "Supervisor Ext or Phone",
        createPassword: "Min. 8 characters",
        confirmPassword: "Re-type password"
      },
      loginFailed: "Login Failed",
      invalidCredentials: "Invalid credentials",
      loggedInAs: "Logged In as",
      redirecting: "Authentication verified. Redirecting to portal...",
      passwordAssistance: "Password Assistance",
      passwordAssistanceMsg: "Password recovery link dispatched via campus email/SMS.",
      facultySso: "Faculty SSO",
      facultySsoMsg: "Redirecting to campus Single Sign-On portal...",
      supervisorHelp: "Supervisor Helpline",
      supervisorHelpMsg: "Contact facility admin at Ext #404.",
      demoStudent: "Demo Student:",
      demoFaculty: "Demo Faculty:",
      demoWorker: "Demo Electrician:",
      demoAdmin: "Demo Admin:",
      quickTest: "Quick Test:",
      studentRegDemoDesc: "Populate sample student registration",
      facultyRegDemoDesc: "Populate sample faculty registration",
      workerRegDemoDesc: "Populate sample maintenance crew",
      unableConnect: "Unable to connect to server",
      passwordsMismatch: "Passwords do not match",
      registrationFailed: "Registration Failed",
      unableCreateAccount: "Unable to create account",
      registrationComplete: "Registration Complete!",
      accountCreatedMsg: "Account created. You can now sign in immediately.",
      demoFilled: "Demo Filled",
      demoStudentLoaded: "Sample student credentials loaded.",
      demoTeacherLoaded: "Sample teacher credentials loaded.",
      demoWorkerLoaded: "Sample worker credentials loaded.",
      demoAdminLoaded: "Sample admin credentials loaded.",
      demoStudentRegLoaded: "Sample student registration details loaded.",
      demoTeacherRegLoaded: "Sample teacher registration details loaded.",
      demoWorkerRegLoaded: "Sample worker registration details loaded."
    }
  },

  mr: {
    appName: "CampusOps",
    chooseLanguage: "Choose Language / भाषा निवडा",
    selectLanguageDesc: "CampusOps वापरण्यासाठी तुमची पसंतीची भाषा निवडा",
    english: "English",
    marathi: "मराठी",
    continue: "पुढे जा",
    tagline: "स्वायत्त सुविधा व शैक्षणिक व्यवस्थापन केंद्र",
    activePersona: "सक्रिय भूमिका",

    roles: {
      student: "विद्यार्थी कक्ष",
      faculty: "प्राध्यापक कक्ष",
      facility: "देखभाल कर्मचारी",
      admin: "कॅम्पस प्रशासक",
      studentSub: "01 • विद्यार्थी कक्ष",
      facultySub: "02 • प्राध्यापक कक्ष",
      facilitySub: "03 • देखभाल कर्मचारी",
      adminSub: "04 • प्रशासक कार्यालय"
    },

    roleDescriptions: {
      student: "फोटो व स्थानासह तक्रार नोंदवा, दुरुस्तीची प्रगती पहा आणि कॉलेज सूचना तपासा.",
      faculty: "वर्गातील समस्यांना तातडीने मान्यता द्या, प्राधान्य वाढवा आणि उपकरण तपासणी निश्चित करा.",
      facility: "कामांची यादी तपासा, सुरक्षितता LOTO पडताळणी करा आणि दुरुस्तीचा पुरावा सबमिट करा.",
      admin: "बाहेरील कंत्राटदार मान्यता, तंत्रज्ञ हजेरी आणि वारंवार होणाऱ्या बिघाडांचे विश्लेषण करा."
    },

    auth: {
      studentTitle: "विद्यार्थी प्रवेश",
      studentSubtitle: "सुविधांची समस्या नोंदवण्यासाठी आणि दुरुस्ती प्रगती पाहण्यासाठी साइन इन करा.",
      facultyTitle: "प्राध्यापक प्रवेश",
      facultySubtitle: "शैक्षणिक अडचणींचे जलद निवारण करा आणि कॅम्पस दुरुस्तीला मान्यता द्या.",
      facilityTitle: "देखभाल कर्मचारी प्रवेश",
      facilitySubtitle: "तुमची दैनंदिन कामे आणि सुरक्षितता तपासणी सूची तपासा.",
      adminTitle: "प्रशासक कार्यालय प्रवेश",
      adminSubtitle: "कॅम्पस पायाभूत सुविधा नियंत्रण आणि कंत्राटदार मंजुरी कक्ष.",
      rollNumber: "हजेरी क्रमांक / विद्यार्थी ID",
      rollNumberPlaceholder: "उदा. CS2024-042",
      mobileNumber: "मोबाईल क्रमांक",
      mobileNumberPlaceholder: "१०-अंकी नोंदणीकृत क्रमांक",
      email: "महाविद्यालयीन ईमेल",
      emailPlaceholder: "prof.name@college.edu",
      password: "पासवर्ड",
      passwordPlaceholder: "तुमचा पासवर्ड टाका",
      accessKey: "ॲक्सेस की (Access Key)",
      accessKeyPlaceholder: "प्राध्यापक ॲक्सेस की टाका",
      staffId: "कर्मचारी ID / बॅज क्र.",
      staffIdPlaceholder: "उदा. FAC-882",
      pin: "सुरक्षा पिन (PIN)",
      pinPlaceholder: "४-अंकी सुरक्षा पिन",
      adminUsername: "प्रशासक युजरनेम",
      adminUsernamePlaceholder: "उदा. admin.estate",
      signInStudent: "विद्यार्थी पोर्टलवर साइन इन करा",
      signInFaculty: "प्राध्यापक पोर्टलवर साइन इन करा",
      signInFacility: "कर्मचारी कक्षात साइन इन करा",
      signInAdmin: "प्रशासक पोर्टलवर साइन इन करा",
      quickDemo: "डेमो लॉगिन (Quick Demo)",
      rememberMe: "३० दिवसांसाठी हे डिव्हाइस लक्षात ठेवा",
      forgotDetails: "लॉगिन माहिती विसरलात?",
      contactEstate: "प्रशासक मदत कक्षाशी संपर्क साधा",
      signingIn: "साइन इन होत आहे..."
    },

    nav: {
      dashboard: "डॅशबोर्ड",
      reportProblem: "समस्या नोंदवा",
      myTickets: "माझ्या तक्रारी",
      allIssues: "सर्व कॅम्पस तक्रारी",
      myIssues: "मी नोंदवलेल्या तक्रारी",
      notices: "महत्त्वाच्या सूचना",
      scanQr: "खोलीचा QR कोड स्कॅन करा",
      signOut: "लॉग आऊट",
      notifications: "सूचना",
      activeIncidents: "सक्रिय समस्या",
      vendorApprovals: "कंत्राटदार मान्यता",
      rosterShift: "हजेरी व AI बदल",
      breakdownRadar: "बिघाड रडार"
    },

    categories: {
      electrical: "विद्युत व प्रकाशयोजना",
      projector: "प्रोजेक्टर व ऑडिओ/व्हिज्युअल",
      plumbing: "प्लंबिंग व पाणीपुरवठा",
      hvac: "वातानुकूलन व HVAC",
      furniture: "बाक व वर्गखोली फर्निचर",
      housekeeping: "स्वच्छता व देखभाल"
    },

    student: {
      hubTitle: "विद्यार्थी तक्रार केंद्र व सूचना फलक",
      hubBadge: "विद्यार्थी केंद्र",
      hubSubtitle: "विद्यार्थी सुविधा तक्रार व थेट पाठपुरावा पोर्टल",
      aiTriageStatus: "AI ट्रायज प्रेषण सक्रिय",
      campusNoticeBoard: "कॅम्पस सूचना फलक",
      noticeBoardDesc: "अधिकृत प्रशासकीय परिपत्रके व AI-चालित स्वायत्त सुविधा अपडेट्स",
      allFeed: "सर्व सूचना",
      adminBulletins: "प्रशासकीय परिपत्रके",
      aiReports: "AI अहवाल व निरीक्षणे",
      scanQrTag: "QR टॅग स्कॅन करा",
      recommendedReports: "शिफारस केलेल्या तक्रारी",
      recommendedSub: "नवीन तक्रार नोंदवण्यापूर्वी दुबार समस्या तपासा व मत (Upvote) द्या",
      reportModalTitle: "कॅम्पस सुविधा समस्या नोंदवा",
      categoryLabel: "समस्येचा प्रकार *",
      locationLabel: "वर्गखोली / स्थान *",
      locationPlaceholder: "उदा. ब्लॉक सी • रूम ३०२ किंवा QR स्कॅन करा",
      descriptionLabel: "समस्येचे सविस्तर वर्णन *",
      descPlaceholder: "स्पष्ट माहिती लिहा (उदा. स्विचबोर्ड स्पार्क, सैल वायर, पंख्याचा आवाज)...",
      photoProofLabel: "फोटो / प्रत्यक्ष पुरावा",
      photoHint: "AI ट्रायज व कर्मचाऱ्यांना उपयुक्त",
      takePhotoCamera: "कॅमेऱ्याने फोटो काढा",
      uploadLaptop: "लॅपटॉपवरून अपलोड करा",
      submitForTriage: "तपासणीसाठी तक्रार सबमिट करा",
      matchingReport: "जुळणारी तक्रार",
      matchingReports: "जुळणाऱ्या तक्रारी",
      initialProofPhoto: "सुरुवातीचा फोटो पुरावा",
      afterRepairProof: "दुरुस्तीनंतरचा पडताळणी पुरावा",
      upvotes: "मते",
      location: "स्थान",
      cameraLive: "कॅमेरा सुरू आहे",
      snapPhoto: "फोटो काढा",
      cancel: "रद्द करा",
      photoAttached: "फोटो जोडला (डेटाबेसमध्ये सुरक्षित होईल)",
      ready: "तयार",
      attachedProofPreview: "जोडलेल्या पुराव्याची पूर्वावलोकन",
      fullscreen: "पूर्ण स्क्रीन",
      retakeChange: "पुन्हा काढा / बदला",
      remove: "काढा",
      scanLocationQr: "स्थानाचा QR स्कॅन करा",
      pointCameraQr: "खोलीच्या QR कोडवर कॅमेरा रोखा",
      photoEvidence: "फोटो पुरावा",
      storedSecurely: "डेटाबेसमध्ये सुरक्षित साठवले",
      close: "बंद करा",
      telemetry: "थेट कॅम्पस कार्यप्रणाली माहिती व विद्यार्थी मते (Upvotes)",
      verifiedFeed: "अधिकृत कॅम्पस सूचना फीड",
      officialNotices: "महाविद्यालयाकडून अधिकृत सतर्कता संदेश आणि तातडीच्या घोषणा",
      searchPlaceholder: "खोली, लॅब किंवा समस्येचे नाव शोधा...",
      reportIssueBtn: "समस्या नोंदवा",
      activeReports: "सक्रिय तक्रारी",
      noDuplicateFound: "कोणतीही जुळणारी तक्रार आढळली नाही",
      noDuplicateDesc: "या समस्येशी मिळतीजुळती तक्रार अजून कोणीही नोंदवलेली नाही. तुम्ही ही समस्या सर्वप्रथम नोंदवू शकता!",
      reportThisIssueNow: "आता ही समस्या नोंदवा",
      noActiveTickets: "सध्या कोणतीही सक्रिय तक्रार नाही.",
      similarIssuesFound: "मिळत्याजुळत्या तक्रारी आधीच नोंदवल्या आहेत!",
      rankedBySimilarity: "साम्यानुसार क्रमवारी",
      upvoteExistingDesc: "दुबार तक्रार नोंदवण्याऐवजी खालील तक्रारीला 'मत द्या (Upvote)' जेणेकरून त्याचे महत्त्व वाढेल:",
      topMatch: "सर्वात जुळणारी",
      mostSimilar: "सर्वात मिळतीजुळती तक्रार",
      keywordMatch: "जुळणारे शब्द",
      matchedKeywords: "जुळलेले शब्द:"
    },

    reportModal: {
      title: "कॅम्पस समस्या नोंदवा",
      subtitle: "देखभाल कर्मचाऱ्यांशी थेट संपर्क",
      locationLabel: "वर्गखोली / लॅबचे स्थान *",
      locationPlaceholder: "उदा. ब्लॉक सी - रूम ३०१, लॅब २",
      issueTitleLabel: "समस्येचे शीर्षक *",
      issueTitlePlaceholder: "उदा. स्विचबोर्ड शॉर्ट सर्किट, पाणी गळती",
      categoryLabel: "समस्येचा विभाग *",
      categoryPlaceholder: "विभाग निवडा",
      categories: {
        electrical: "विद्युत (Wiring, Sockets, Lights)",
        plumbing: "प्लंबिंग (Taps, Pipes, Washrooms)",
        hvac: "HVAC (AC, Fans, Ventilation)",
        carpentry: "सुतारकाम (Benches, Doors, Windows)",
        it: "IT व प्रोजेक्टर (AV, Wi-Fi, Screens)",
        civil: "स्वच्छता व इमारत देखभाल (Flooring, Painting)"
      },
      descriptionLabel: "सविस्तर माहिती *",
      descriptionPlaceholder: "कृपया समस्येचे सविस्तर वर्णन लिहा...",
      photoEvidence: "फोटो पुरावा (ऐच्छिक)",
      uploadPhoto: "डिव्हाइसमधून अपलोड करा",
      takePhoto: "कॅमेऱ्याने फोटो काढा",
      cameraActive: "कॅमेरा सुरू आहे - समस्येचा फोटो मध्यभागी ठेवा",
      capture: "फोटो काढा",
      cancelCamera: "कॅमेरा बंद करा",
      photoAttached: "फोटो जोडला गेला आहे",
      submitReport: "तक्रार सबमिट करा",
      submitting: "सबमिट होत आहे...",
      cancel: "रद्द करा"
    },

    ticket: {
      ticketId: "तक्रार",
      telemetryHeader: "थेट माहिती, पुरावे व कार्य प्रगती टाइमलाइन",
      generalIssue: "सामान्य समस्या",
      location: "स्थान:",
      reportedBy: "तक्रारदार:",
      subtitle: "थेट टेलिमेट्री, पुरावा व तपासणी टाइमलाइन",
      locationLabel: "स्थान:",
      reported: "नोंदणी तारीख:",
      verifiedSubmission: "प्रमाणित नोंदणी",
      initialVisualProof: "तक्रारदाराने दिलेला सुरुवातीचा फोटो पुरावा",
      resolutionProof: "दुरुस्तीनंतरचा फोटो पुरावा",
      beforeRepair: "दुरुस्तीपूर्वीचा फोटो (नोंदणीवेळी)",
      afterRepair: "दुरुस्तीनंतरचा फोटो (काम पूर्ण पुरावा)",
      viewHighRes: "स्पष्ट फोटो पहा",
      storedInDb: "डेटाबेसमध्ये सुरक्षित",
      noPhotoAttached: "या तक्रारीसोबत कोणताही फोटो जोडलेला नाही.",
      technicianNotes: "तंत्रज्ञाची दुरुस्ती नोंद",
      operationalTimeline: "थेट कार्यप्रणाली टाइमलाइन",
      timelineSubtitle: "तक्रार नोंदणीपासून अंतिम पडताळणीपर्यंतचा संपूर्ण प्रवास",
      step1Title: "नोंदणी झाली व AI द्वारे वर्गीकरण",
      step1Desc: "समस्येच्या विभागानुसार कर्मचाऱ्याकडे आपोआप सोपवली",
      step2Title: "दुरुस्ती सुरू आहे व सुरक्षितता तपासली",
      step2Desc: "तंत्रज्ञ जागेवर काम करत आहेत",
      step3Title: "कामाचा पुरावा सादर व तक्रार बंद",
      step3Desc: "समस्येचे यशस्वी निराकरण झाले आणि पडताळणी पूर्ण झाली",
      satisfactionFeedback: "समाधान अभिप्राय (Feedback)",
      rateRepair: "दुरुस्तीच्या गुणवत्तेचे मूल्यांकन करा:",
      submitReview: "अभिप्राय सबमिट करा",
      availableAfterResolution: "दुरुस्ती पूर्ण झाल्यावर उपलब्ध होईल",
      feedbackSubmitted: "अभिप्राय नोंदवला गेला आहे",
      submittingReview: "अभिप्राय पाठवत आहे...",
      upvote: "मत द्या (Upvote)",
      share: "शेअर करा",
      highPriority: "अति महत्त्वाचे",
      urgentSla: "तातडीचे काम",
      facultyEndorsed: "प्राध्यापक प्रमाणित",
      statuses: {
        open: "नोंदवलेली समस्या",
        inProgress: "काम सुरू आहे",
        resolved: "निराकरण झाले",
        escrowApproved: "मंजूर काम"
      }
    },

    teacher: {
      hubTitle: "प्राध्यापक कक्ष व जलद निवारण",
      subtitle: "शैक्षणिक अडचणींचे जलद निवारण करा आणि दुरुस्तीला मान्यता द्या",
      classInSession: "वर्ग सुरू आहे का? वर्गातील दुरुस्तीला त्वरित प्राधान्य द्या",
      endorseTicket: "तक्रार प्रमाणित करा",
      endorsed: "प्रमाणित केले",
      verifiedFaculty: "प्राध्यापक प्रमाणित तक्रार",
      slaFastTrack: "शैक्षणिक SLA जलद-गती सक्रिय",
      academicNotices: "कॅम्पस व शैक्षणिक सूचना",
      noticesDesc: "प्रशासकीय सूचना, प्राध्यापक सल्लागार व AI टेलिमेट्री",
      reportAcademicIssue: "आता शैक्षणिक समस्या नोंदवा",
      submitAcademicTicket: "शैक्षणिक तक्रार सबमिट करा",
      scanClassroomQr: "वर्गखोलीचा QR स्कॅन करा",
      pointCameraClassroom: "वर्गखोली किंवा उपकरणाच्या QR कोडवर कॅमेरा रोखा",
      classInSessionTitle: "⚡ वर्ग चालू आहे / चालू व्याख्यान",
      classInSessionDesc: "अति तातडीने पाठवले जाते, प्राधान्य स्कोअर ९५+ वाढवते आणि त्वरित निवारणासाठी सूचना देते.",
      cameraLive: "प्राध्यापक कॅमेरा सुरू",
      searchPlaceholder: "तपासणी किंवा प्रमाणीकरणासाठी समस्या शोधा (उदा. प्रोजेक्टर, AC, लॅब ४०२)...",
      activeClassroomHazards: "शैक्षणिक व कॅम्पस तक्रार सूची",
      hazardsDesc: "प्राध्यापक पडताळणीमुळे तंत्रज्ञांसाठी त्वरित प्राधान्य SLA लागू होते",
      endorseModalTitle: "शैक्षणिक / वर्गातील समस्या नोंदवा",
      priorityLabel: "प्राधान्य",
      endorsedByFaculty: "प्राध्यापकांनी प्रमाणित केले",
      endorseAction: "तक्रार प्रमाणित करा"
    },

    facility: {
      deskTitle: "सुविधा व तंत्रज्ञ कार्य केंद्र",
      controlDesk: "तंत्रज्ञ नियंत्रण केंद्र",
      subtitle: "सक्रिय कामांची यादी व ऑन-साइट दुरुस्ती प्रणाली",
      controlSub: "विभागीय समस्या निवारण, सुरक्षा LOTO आणि फोटो पुरावा पडताळणी",
      shiftActive: "सक्रिय शिफ्ट सुरू आहे • थेट डेटाबेस सिंक",
      myTradeTasks: "माझ्या विभागाची कामे",
      urgentSla: "तातडीचे SLA / वर्ग सुरू",
      inProgressKpi: "प्रगतीपथावर",
      resolvedVerified: "निवारण आणि पडताळणी पूर्ण",
      deptQueueTitle: "विभागीय कामे आणि तक्रार रांग",
      deptQueueSub: "तंत्रज्ञ विशेषज्ञतेनुसार फिल्टर करा किंवा सर्व कॅम्पस तक्रारी पहा",
      myTradePrefix: "माझा विभाग:",
      allCampus: "सर्व कॅम्पस तक्रारी",
      allTrades: "सर्व कामे",
      electrical: "विद्युत",
      plumbing: "प्लंबिंग",
      hvac: "HVAC",
      carpentry: "सिव्हिल / फर्निचर",
      it: "IT A/V",
      civil: "इमारत देखभाल",
      allActive: "सर्व सक्रिय",
      unassigned: "नियुक्त न केलेले",
      inProgress: "सुरू असलेले",
      completed: "पूर्ण झालेले",
      searchTasksPlaceholder: "क्लासरूम (उदा. लॅब 402), तिकीट आयडी किंवा कीवर्डने शोधा...",
      scanAreaQr: "परिसराचा QR स्कॅन करा",
      showingFiltered: "येथे दाखवलेली कामे:",
      clearFilter: "फिल्टर काढा",
      assignedQueue: "नेमून दिलेल्या कामांची रांग",
      assignedQueueSub: "काम स्वीकारा, सुरक्षा चेकलिस्ट तपासा आणि निवारण फोटो पुरावा सबमिट करा",
      acceptTask: "काम स्वीकारा",
      safetyChecklist: "सुरक्षा चेकलिस्ट",
      lotoVerified: "✓ सुरक्षा LOTO पडताळले",
      markResolved: "निवारण नोंदवा (पुरावा)",
      verifiedBy: "निवारण आणि पडताळणी:",
      classInSession: "वर्ग सुरू आहे",
      takePhotoCamera: "कॅमेऱ्याने फोटो काढा",
      uploadLaptop: "लॅपटॉपवरून अपलोड करा",
      snapPhoto: "फोटो कॅप्चर करा",
      photoReady: "दुरुस्तीनंतरचा फोटो तयार",
      retake: "पुन्हा काढा",
      remove: "काढा",
      requestVendor: "बाहेरील व्हेंडरची विनंती करा",
      tasksInQueue: "प्रलंबित कामे",
      noActiveOrders: "कोणतीही सक्रिय कामे नाहीत",
      noActiveOrdersSub: "निवडलेल्या विभाग किंवा फिल्टरनुसार कोणतीही कामे उपलब्ध नाहीत.",
      ppe: "१. वैयक्तिक सुरक्षा साधने (PPE)",
      ppeDesc: "इन्सुलेटेड ग्लोव्हज, सेफ्टी गॉगल्स/फेस शील्ड आणि शूज वापरले आहेत.",
      loto: "२. लॉकआऊट / टॅगआऊट (LOTO) पडताळणी",
      lotoDesc: "मेन सर्किट ब्रेकर किंवा व्हॉल्व्ह बंद करून पॅडलॉक लावला आणि टॅग केला.",
      barricade: "३. कामाचे ठिकाण बॅरिकेड केले",
      barricadeDesc: "इशारा फलक लावले, कोन्स ठेवले आणि विद्यार्थ्यांना लांब ठेवले.",
      saveSafety: "सुरक्षितता नोंदवा व दुरुस्ती सुरू करा",
      resolveTicket: "दुरुस्ती पूर्ण झाली म्हणून नोंदवा व पुरावा अपलोड करा",
      uploadResolutionProof: "दुरुस्तीनंतरचा फोटो पुरावा अपलोड करा *",
      resolutionNotesPlaceholder: "काय दुरुस्त केले, कोणते सुटे भाग बदलले ते सविस्तर लिहा...",
      confirmResolution: "निराकरण निश्चित करा व डेटाबेस अपडेट करा"
    },

    admin: {
      deskTitle: "कॅम्पस प्रशासक कार्यालय",
      subtitle: "मध्यवर्ती सुविधा व्यवस्थापन, कंत्राटदार मान्यता व हजेरी",
      postNotice: "कॅम्पस सूचना प्रसिद्ध करा",
      requiresSignOff: "मान्यता आवश्यक",
      liveIncidents: "सक्रिय समस्या",
      groundWorkforce: "कार्यरत कर्मचारी",
      recurringRadar: "वारंवार बिघाड रडार",
      vendorApprovals: "कंत्राटदार मान्यता",
      pendingContractorTitle: "प्रलंबित बाहेरील कंत्राटदार मान्यता",
      pendingContractorSub: "तंत्रज्ञांनी तपासणी करून बाहेरील यंत्रसामग्री/साधने आवश्यक असल्याचे प्रमाणित केले आहे",
      activeIncidentQueue: "सक्रिय तक्रार रांग",
      activeTicketsTitle: "कॅम्पस सक्रिय तक्रारी",
      activeTicketsSub: "सर्व वर्गखोल्या, प्रयोगशाळा आणि कॉरिडॉर तक्रारींचे संपूर्ण विहंगावलोकन",
      filterAdminPlaceholder: "खोली, श्रेणी किंवा तिकीट आयडीनुसार शोधा...",
      rosterAI: "रोस्टर व AI ऑटो-शिफ्ट",
      hotspots: "कॅम्पस बिघाड हॉटस्पॉट्स",
      tableTicket: "तिकीट",
      tableLocation: "स्थान",
      tableProblem: "समस्या",
      tableUpvotes: "मते / मान्यता",
      tableCrew: "नियुक्त कर्मचारी",
      tableAction: "कृती",
      manage: "व्यवस्थापन",
      rosterTitle: "कर्मचारी हजेरी व AI व्यवस्थापन",
      rosterSub: "जेव्हा एखादा तंत्रज्ञ गैरहजर राहतो, तेव्हा AI ट्रायज त्यांची कामे ऑन-ड्युटी कर्मचाऱ्यांकडे सोपवते",
      radarTitle: "कॅम्पस बिघाड रडार व मूळ कारणे",
      approvePo: "PO मंजूर करा व गेट पास द्या",
      completeWork: "काम पूर्ण व बिल नोंदणी करा",
      reassignTask: "काम दुसऱ्या तंत्रज्ञाकडे सोपवा",
      triggerSync: "हजेरी ऑटो-सिंक तपासा",
      publishNotice: "कॅम्पस सूचना प्रसिद्ध करा",
      noticeType: "सूचनेचा प्रकार *",
      noticeHeadline: "शीर्षक *",
      noticeLocation: "प्रभावित खोली / ब्लॉक *",
      noticeInstructions: "विद्यार्थी व प्राध्यापकांसाठी सूचना *",
      broadcastNotice: "सर्व पोर्टल्सवर सूचना प्रसिद्ध करा",
      reassignTech: "तंत्रज्ञ बदला",
      noIncidents: "कोणतीही सक्रिय समस्या नाही",
      noPendingVendors: "कोणतीही प्रलंबित कंत्राटदार मान्यता नाही.",
      locAndMachine: "स्थान व मशीन",
      assignedTo: "नियुक्त व्यक्ती:",
      description: "वर्णन:",
      contractStatus: "करार स्थिती:",
      underActiveAmc: "सक्रिय AMC अंतर्गत",
      outOfWarranty: "वॉरंटी संपली (थेट खरेदी आवश्यक)",
      estimatedCost: "अंदाजे खर्च:",
      coveredByAmc: "₹० (AMC द्वारे समाविष्ट)",
      requiresQuote: "कोटेशन आवश्यक",
      assignedVendorOem: "नियुक्त कंत्राटदार / OEM",
      radarSub: "वारंवार होणाऱ्या बिघाडांची नोंद, जेणेकरून पूर्ण वायरिंग/बदल करण्याचे आदेश देता येतील",
      liveSpatial: "थेट स्थाननिहाय हॉटस्पॉट्स",
      mttrTrends: "MTTR व बिघाड ट्रेंड्स",
      noticeSub: "विद्यार्थी आणि शिक्षक सूचना फलकांवर त्वरित दिसेल",
      chooseStaff: "नवीन कर्मचारी निवडा *",
      reassignReason: "पुन्हा नेमण्याचे कारण *",
      confirmPush: "निश्चित करा व तंत्रज्ञांच्या फोनवर पाठवा",
      totalCost: "एकूण खर्च / आवश्यक रक्कम (₹) *",
      workDoneDetails: "कामाचा व दुरुस्तीचा सविस्तर तपशील *",
      saveResolved: "माहिती जतन करा व पूर्ण घोषित करा",
      adjustLoad: "कामाचा भार बदला",
      currentLoad: "सध्याचा भार:"
    },

    qr: {
      title: "कॅम्पसऑप्स QR ओळख (Resolver)",
      subtitle: "स्मार्ट वर्गखोली व उपकरण टॅग पडताळणी",
      recognized: "QR टॅग ओळखला गेला",
      selectRole: "तुमची भूमिका निवडा:",
      studentRoute: "मी विद्यार्थी आहे (येथे समस्या नोंदवा)",
      facultyRoute: "मी प्राध्यापक आहे (तातडीने मान्यता द्या)",
      workerRoute: "मी देखभाल कर्मचारी आहे (कामांची यादी पहा)",
      scanRoomQr: "वर्गखोली / लॅबचा QR स्कॅन करा",
      cameraInstructions: "कामांची यादी पाहण्यासाठी खोलीचा QR टॅग स्कॅन करा",
      zoneMapped: "मेन स्विचबोर्ड आणि प्रोजेक्टर या प्रत्यक्ष परिसराशी जोडलेले आहेत."
    },

    common: {
      success: "यशस्वी",
      error: "त्रुटी",
      info: "माहिती",
      close: "बंद करा",
      loading: "लोड होत आहे...",
      viewImage: "स्पष्ट फोटो पहा",
      copied: "क्लिपबोर्डवर कॉपी झाले!",
      actionCompleted: "क्रिया यशस्वीरीत्या पूर्ण झाली."
    },

    login: {
      activePersona: "सक्रिय भूमिका",
      studentSubtitle: "विद्यार्थी व तक्रारकर्ता",
      facultySubtitle: "शैक्षणिक अधिकारी",
      facilitySubtitle: "देखभाल पथक",
      adminSubtitle: "मुख्य प्रशासकीय अधिकारी",
      signInTab: "साइन इन करा",
      registerTab: "नोंदणी करा",
      rememberTerminal: "या डिव्हाइसवर माहिती लक्षात ठेवा",
      safeKey: "विद्यार्थी SafeKey",
      autoFillDemo: "⚡ डेमो माहिती भरा",
      studentBadge: "01 • विद्यार्थी कक्ष",
      studentLoginTitle: "विद्यार्थी प्रवेश द्वार",
      studentLoginSub: "समस्या नोंदवण्यासाठी आणि प्रगती पाहण्यासाठी PRN / हजेरी क्रमांक किंवा कॉलेज ईमेलने साइन in करा.",
      studentSignupTitle: "विद्यार्थी खाते नोंदणी",
      studentSignupSub: "समस्या नोंदवण्यासाठी व पाठपुरावा करण्यासाठी तुमचे विद्यार्थी खाते तयार करा.",
      loginAction: "विद्यार्थी कक्षात प्रवेश करा →",
      signupAction: "विद्यार्थी खाते तयार करा →",
      studentLoginAction: "विद्यार्थी कक्षात प्रवेश करा →",
      studentSignupAction: "विद्यार्थी खाते तयार करा →",
      teacherBadge: "02 • प्राध्यापक कक्ष",
      teacherLoginTitle: "प्राध्यापक शैक्षणिक कक्ष",
      teacherLoginSub: "वर्गातील तातडीच्या समस्यांना मान्यता देण्यासाठी कर्मचारी ID सह साइन इन करा.",
      teacherSignupTitle: "प्राध्यापक खाते नोंदणी",
      teacherSignupSub: "विभागीय माहितीसह तुमचे शैक्षणिक प्रोफाइल तयार करा.",
      teacherLoginAction: "प्राध्यापक कक्षात प्रवेश करा →",
      teacherSignupAction: "प्राध्यापक खाते तयार करा →",
      workerBadge: "03 • देखभाल कक्ष",
      workerLoginTitle: "देखभाल व दुरुस्ती कक्ष",
      workerLoginSub: "प्राधान्यक्रमित दुरुस्ती कामे पाहण्यासाठी कामगार ID किंवा फोन नंबरने साइन इन करा.",
      workerSignupTitle: "कर्मचारी नोंदणी",
      workerSignupSub: "तुमचे कौशल्य व शिफ्ट ड्युटीची नोंदणी करा.",
      workerLoginAction: "देखभाल कक्षात प्रवेश करा →",
      workerSignupAction: "कर्मचारी नोंदणी करा →",
      adminBadge: "04 • प्रशासक कार्यालय",
      adminLoginTitle: "कॅम्पस प्रशासक कक्ष",
      adminLoginSub: "स्वायत्त सुविधा व्यवस्थापन व कंत्राटदार मान्यतेसाठी प्रशासक क्रेडेंशियलसह साइन इन करा.",
      adminSignupTitle: "प्रशासक प्रवेश विनंती",
      adminSignupSub: "प्रशासकीय अधिकारासाठी सुपरवायझर क्रेडेंशियल सबमिट करा.",
      adminLoginAction: "प्रशासक कन्सोलमध्ये प्रवेश करा →",
      adminSignupAction: "प्रशासक प्रवेश विनंती पाठवा →",
      prnOrEmail: "PRN / हजेरी क्रमांक किंवा कॉलेज ईमेल *",
      password: "पासवर्ड *",
      forgotPassword: "पासवर्ड विसरलात?",
      facultyIdOrEmail: "प्राध्यापक कर्मचारी ID किंवा अधिकृत ईमेल *",
      academicDepartment: "शैक्षणिक विभाग *",
      institutionalPassword: "महाविद्यालयीन पासवर्ड *",
      keepSession: "प्राध्यापक सत्र सक्रिय ठेवा",
      executivePriority: "उच्च SLA प्राधान्य",
      workerIdOrPhone: "कर्मचारी / कामगार ID किंवा मोबाईल क्र. *",
      assignedCategory: "नेमलेली श्रेणी *",
      primaryShift: "मुख्य कामाची शिफ्ट *",
      passwordPin: "पासवर्ड / पिन *",
      offlineActive: "ऑफलाइन ऑटो-सिंक सक्रिय",
      estateIdOrEmail: "प्रशासक ID किंवा अधिकृत ईमेल *",
      adminClearance: "प्रशासकीय अधिकार स्तर *",
      masterPassword: "मुख्य सुरक्षा पासवर्ड *",
      tokenRequired: "2FA टोकन आवश्यक",
      fullName: "पूर्ण नाव *",
      mobileNumber: "मोबाईल क्रमांक (SMS सूचना) *",
      officialEmail: "अधिकृत कॉलेज ईमेल *",
      confirmPassword: "पासवर्डची पुष्टी करा *",
      triageEngine: "ट्रायज इंजिन",
      masterGovernanceDesc: "मुख्य प्रशासकीय नियंत्रण: सर्व कंत्राटदार PO मंजुरी व AI हजेरी अधिकार सक्रिय.",
      quickFillDemo: "⚡ डेमो माहिती भरा",
      confirmRecords: "मी खात्री देतो की माझी माहिती अधिकृत कॉलेज नोंदीशी जुळते.",
      useSso: "SSO वापरावे?",
      supervisorPin: "पर्यवेक्षक पिन?",
      studentPrn: "विद्यार्थी PRN / हजेरी क्रमांक *",
      departmentBranch: "विभाग / शाखा *",
      academicYear: "शैक्षणिक वर्ष *",
      divisionSection: "तुकडी / सेक्शन *",
      facultyId: "प्राध्यापक कर्मचारी ID *",
      designation: "पद / पदनाम *",
      cabinNo: "केबिन / खोली क्रमांक *",
      workerId: "कर्मचारी / कामगार ID *",
      supervisorExt: "पर्यवेक्षक विस्तार क्रमांक *",
      createPassword: "नवीन पासवर्ड तयार करा *",
      departments: {
        cs: "संगणक विज्ञान व अभियांत्रिकी विभाग",
        it: "माहिती तंत्रज्ञान विभाग",
        mech: "यांत्रिकी अभियांत्रिकी विभाग",
        civil: "स्थापत्य अभियांत्रिकी विभाग",
        ee: "विद्युत व इलेक्ट्रॉनिक्स विभाग"
      },
      trades: {
        electrical: "विद्युत देखभाल व ऊर्जा",
        plumbing: "प्लंबिंग व पाणीपुरवठा",
        hvac: "वातानुकूलन व लॅब यंत्रणा",
        sanitation: "स्वच्छता व देखभाल",
        carpentry: "सुतारकाम व फर्निचर",
        it: "माहिती तंत्रज्ञान व नेटवर्क"
      },
      shifts: {
        morning: "सकाळची शिफ्ट (०७:०० - १५:००)",
        general: "सर्वसाधारण दिवस (०९:०० - १७:००)",
        evening: "संध्याकाळची शिफ्ट (१४:०० - २२:००)",
        night: "रात्रपाळी (२२:०० - ०६:००)"
      },
      clearanceLevels: {
        chief: "मुख्य मालमत्ता व परिचालन अधिकारी",
        senior: "वरिष्ठ कॅम्पस देखभाल पर्यवेक्षक",
        vendor: "संस्थात्मक खरेदी व कंत्राटदार नियंत्रक"
      },
      designations: {
        asstProf: "सहाय्यक प्राध्यापक",
        assocProf: "सहयोगी प्राध्यापक",
        hod: "विभागप्रमुख (HOD)",
        labInCharge: "प्रयोगशाळा प्रमुख"
      },
      years: {
        y1: "प्रथम वर्ष (सत्र १-२)",
        y2: "द्वितीय वर्ष (सत्र ३-४)",
        y3: "तृतीय वर्ष (सत्र ५-६)",
        y4: "अंतिम वर्ष (सत्र ७-८)"
      },
      placeholders: {
        studentIdentifier: "उदा. 2024CS1092 किंवा roll.no@campus.edu",
        facultyIdentifier: "उदा. FAC-3042 किंवा prof.sharma@campus.edu",
        workerIdentifier: "उदा. WRK-504 किंवा +919823045129",
        adminIdentifier: "उदा. ADMIN-01 किंवा estate.office@campus.edu",
        password: "••••••••••••",
        fullName: "उदा. आदिती शर्मा",
        phone: "उदा. +९१ ९८२३० ४५१२९",
        email: "name@campus.edu",
        studentPrn: "उदा. 2024CS1092",
        division: "उदा. तुकडी ब – बॅच बी२",
        facultyId: "उदा. EMP-3042",
        cabinNo: "उदा. ब्लॉक बी - रूम ३०४",
        workerId: "उदा. WRK-504",
        supervisorExt: "पर्यवेक्षक विस्तार किंवा फोन",
        createPassword: "किमान ८ अक्षरे",
        confirmPassword: "पुन्हा पासवर्ड टाका"
      },
      loginFailed: "लॉगिन अयशस्वी",
      invalidCredentials: "अवैध लॉगिन माहिती",
      loggedInAs: "या भूमिकेत लॉगिन झाले:",
      redirecting: "प्रमाणीकरण यशस्वी. पोर्टलवर पुनर्निर्देशित करत आहे...",
      passwordAssistance: "पासवर्ड सहाय्य",
      passwordAssistanceMsg: "पासवर्ड पुनर्प्राप्ती लिंक कॉलेज ईमेल/SMS द्वारे पाठवली आहे.",
      facultySso: "प्राध्यापक SSO",
      facultySsoMsg: "कॅम्पस सिंगल साइन-ऑन पोर्टलवर पुनर्निर्देशित करत आहे...",
      supervisorHelp: "पर्यवेक्षक हेल्पलाईन",
      supervisorHelpMsg: "सुविधा प्रशासकाशी Ext #404 वर संपर्क साधा.",
      demoStudent: "डेमो विद्यार्थी:",
      demoFaculty: "डेमो प्राध्यापक:",
      demoWorker: "डेमो इलेक्ट्रिशियन:",
      demoAdmin: "डेमो प्रशासक:",
      quickTest: "जलद चाचणी:",
      studentRegDemoDesc: "विद्यार्थी नोंदणी नमुना भरा",
      facultyRegDemoDesc: "प्राध्यापक नोंदणी नमुना भरा",
      workerRegDemoDesc: "देखभाल कर्मचारी नमुना भरा",
      unableConnect: "सर्व्हरशी संपर्क होऊ शकला नाही",
      passwordsMismatch: "दोन्ही पासवर्ड जुळत नाहीत",
      registrationFailed: "नोंदणी अयशस्वी",
      unableCreateAccount: "खाते तयार करणे शक्य झाले नाही",
      registrationComplete: "नोंदणी यशस्वी!",
      accountCreatedMsg: "खाते तयार झाले आहे. आपण आता लगेच साइन इन करू शकता.",
      demoFilled: "डेमो माहिती भरली",
      demoStudentLoaded: "विद्यार्थी चाचणी माहिती भरली गेली.",
      demoTeacherLoaded: "प्राध्यापक चाचणी माहिती भरली गेली.",
      demoWorkerLoaded: "कर्मचारी चाचणी माहिती भरली गेली.",
      demoAdminLoaded: "प्रशासक चाचणी माहिती भरली गेली.",
      demoStudentRegLoaded: "विद्यार्थी नोंदणी नमुना माहिती भरली गेली.",
      demoTeacherRegLoaded: "प्राध्यापक नोंदणी नमुना माहिती भरली गेली.",
      demoWorkerRegLoaded: "कर्मचारी नोंदणी नमुना माहिती भरली गेली."
    }
  }
};

/**
 * Get current stored language or default to 'en'
 * Checks both campusops_language and campusops_lang
 */
function getLanguage() {
  const lang = localStorage.getItem('campusops_language') || localStorage.getItem('campusops_lang') || 'en';
  return (lang === 'mr') ? 'mr' : 'en';
}

/**
 * Lookup nested translation key
 */
function t(key, fallback = '') {
  const lang = getLanguage();
  const keys = key.split('.');
  
  // Try current language
  let val = translations[lang];
  for (const k of keys) {
    if (val && typeof val === 'object' && k in val) {
      val = val[k];
    } else {
      val = null;
      break;
    }
  }
  
  if (typeof val === 'string') return val;

  // Fallback to English
  if (lang !== 'en') {
    let fallbackVal = translations.en;
    for (const k of keys) {
      if (fallbackVal && typeof fallbackVal === 'object' && k in fallbackVal) {
        fallbackVal = fallbackVal[k];
      } else {
        fallbackVal = null;
        break;
      }
    }
    if (typeof fallbackVal === 'string') return fallbackVal;
  }

  return fallback || key;
}

/**
 * Apply translations to all matching DOM elements
 */
function applyTranslations(lang = getLanguage()) {
  if (document.documentElement) {
    document.documentElement.lang = lang === 'mr' ? 'mr' : 'en';
  }

  // 1. Text elements: data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      const translation = t(key);
      if (translation) {
        el.innerText = translation;
      }
    }
  });

  // 2. HTML elements: data-i18n-html
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (key) {
      const translation = t(key);
      if (translation) {
        el.innerHTML = translation;
      }
    }
  });

  // 3. Placeholders: data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (key) {
      const translation = t(key);
      if (translation) {
        el.placeholder = translation;
      }
    }
  });

  // 4. Titles: data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (key) {
      const translation = t(key);
      if (translation) {
        el.title = translation;
      }
    }
  });

  // 5. Update Switcher UI Buttons
  updateSwitcherButtons(lang);

  // 6. Emit event for dynamic components to re-render in new language
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Update visual states of all language switcher controls on the page
 */
function updateSwitcherButtons(lang) {
  document.querySelectorAll('.lang-btn-en').forEach(btn => {
    if (lang === 'en') {
      btn.className = "lang-btn-en px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 text-white shadow-xs transition cursor-pointer";
    } else {
      btn.className = "lang-btn-en px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer";
    }
  });

  document.querySelectorAll('.lang-btn-mr').forEach(btn => {
    if (lang === 'mr') {
      btn.className = "lang-btn-mr px-3 py-1.5 rounded-lg text-xs font-black bg-blue-600 text-white shadow-xs transition cursor-pointer";
    } else {
      btn.className = "lang-btn-mr px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer";
    }
  });
}

/**
 * Set and persist active language across the entire application
 */
function setLanguage(lang) {
  if (lang !== 'en' && lang !== 'mr') lang = 'en';
  localStorage.setItem('campusops_language', lang);
  localStorage.setItem('campusops_lang', lang);
  applyTranslations(lang);
}

/**
 * Generate standard Language Switcher Component HTML
 */
function getLanguageSwitcherHTML() {
  const curLang = getLanguage();
  const isEn = curLang === 'en';
  return `
    <div class="inline-flex items-center bg-white/90 backdrop-blur-md p-1 rounded-xl border border-slate-200 shadow-xs gap-1" role="group" aria-label="Language Selector">
      <button type="button" onclick="setLanguage('en')" class="lang-btn-en px-3 py-1.5 rounded-lg text-xs ${isEn ? 'font-black bg-blue-600 text-white shadow-xs' : 'font-bold text-slate-600 hover:text-slate-900'} transition cursor-pointer">
        🇬🇧 English
      </button>
      <button type="button" onclick="setLanguage('mr')" class="lang-btn-mr px-3 py-1.5 rounded-lg text-xs ${!isEn ? 'font-black bg-blue-600 text-white shadow-xs' : 'font-bold text-slate-600 hover:text-slate-900'} transition cursor-pointer">
        🇮🇳 मराठी
      </button>
    </div>
  `;
}

// Expose globally
window.t = t;
window.getLanguage = getLanguage;
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;
window.getLanguageSwitcherHTML = getLanguageSwitcherHTML;
window.campusOpsTranslations = translations;
window.i18n = {
  t,
  getLanguage,
  setLanguage,
  applyTranslations,
  getLanguageSwitcherHTML,
  translations
};

// Auto-run on DOM ready or immediate if ready
function initCampusOpsLanguage() {
  document.querySelectorAll('[data-lang-switcher]').forEach(container => {
    container.innerHTML = getLanguageSwitcherHTML();
  });
  applyTranslations();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCampusOpsLanguage);
} else {
  initCampusOpsLanguage();
}
