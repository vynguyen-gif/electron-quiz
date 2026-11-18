/**
 * ỨNG DỤNG: GIẢI MÃ CẤU HÌNH ELECTRON
 * Tech-stack: Vanilla JS, Tailwind CSS, Supabase Realtime
 */

(() => {
  // ==========================================================================
  // 1. CẤU HÌNH SUPABASE & DỮ LIỆU CÂU HỎI
  // ==========================================================================
  // Thầy/Cô điền thông tin Supabase tại đây nếu muốn lưu trữ trực tuyến:
  const SUPABASE_URL = "https://YOUR_PROJECT_REF.supabase.co";
  const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";

  const isSupabaseConfigured = 
    SUPABASE_URL && 
    !SUPABASE_URL.includes("YOUR_PROJECT_REF") && 
    SUPABASE_ANON_KEY && 
    !SUPABASE_ANON_KEY.includes("YOUR_ANON_PUBLIC_KEY");

  let sbClient = null;
  if (window.supabase && typeof window.supabase.createClient === "function" && isSupabaseConfigured) {
    try {
      sbClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (err) {
      console.warn("Chưa khởi tạo được Supabase client:", err);
    }
  }

  // Ngân hàng câu hỏi Hóa học (Chuẩn Unicode ký hiệu electron)
  const QUESTIONS = [
    {
      question: "Nguyên tử nguyên tố X có cấu hình e: 1s²2s²2p⁶3s¹. X thuộc ô số mấy và nhóm nào trong bảng tuần hoàn?",
      options: [
        "A. Ô 11, chu kì 3, nhóm IA",
        "B. Ô 11, chu kì 3, nhóm IB",
        "C. Ô 12, chu kì 3, nhóm IIA",
        "D. Ô 10, chu kì 2, nhóm VIIIA"
      ],
      correct: 0,
      explanation: "X có Z = 2+2+6+1 = 11 (Ô 11). Có 3 lớp e -> chu kì 3. Có 1 e hóa trị ở phân lớp s -> nhóm IA (Kim loại kiềm Natri)."
    },
    {
      question: "Cấu hình electron của ion Fe³⁺ (Z = 26) ở trạng thái cơ bản là:",
      options: [
        "A. [Ar] 3d⁵ 4s¹",
        "B. [Ar] 3d⁵",
        "C. [Ar] 3d⁶",
        "D. [Ar] 3d⁴ 4s²"
      ],
      correct: 1,
      explanation: "Cấu hình Fe (Z=26): [Ar] 3d⁶4s². Khi nhường 3 electron tạo Fe³⁺, e ở phân lớp 4s nhường trước rồi đến 3d -> còn lại [Ar] 3d⁵ (bán bão hòa bền vững)."
    },
    {
      question: "Nguyên tử Clo (Z = 17) có số electron độc thân ở trạng thái cơ bản là bao nhiêu?",
      options: [
        "A. 0 electron",
        "B. 1 electron",
        "C. 2 electron",
        "D. 3 electron"
      ],
      correct: 1,
      explanation: "Cấu hình e của Cl: [Ne] 3s²3p⁵. Phân lớp 3p gồm 3 orbital chứa 5 electron (theo quy tắc Hund: ↑↓ ↑↓ ↑) -> Có duy nhất 1 electron độc thân."
    },
    {
      question: "Cấu hình electron nào sau đây là của một khí hiếm bền vững?",
      options: [
        "A. 1s²2s²2p⁶3s²3p⁶",
        "B. 1s²2s²2p⁶3s²3p⁴",
        "C. 1s²2s²2p⁴",
        "D. 1s²2s²2p⁶3s¹"
      ],
      correct: 0,
      explanation: "Cấu hình 1s²2s²2p⁶3s²3p⁶ có 8 electron ở lớp ngoài cùng (bát thế octet bền vững), đây là cấu hình của khí hiếm Argon (Ar, Z=18)."
    },
    {
      question: "Nguyên tố Cr (Z = 24) có cấu hình electron đặc biệt do hiện tượng bán bão hòa là:",
      options: [
        "A. [Ar] 3d⁴ 4s²",
        "B. [Ar] 3d⁵ 4s¹",
        "C. [Ar] 3d⁶ 4s⁰",
        "D. [Ar] 3d³ 4s² 4p¹"
      ],
      correct: 1,
      explanation: "Cr có hiện tượng chuyển 1 electron từ 4s vào 3d để đạt trạng thái bán bão hòa 3d⁵ bền vững hơn cấu hình giả định 3d⁴4s²."
    }
  ];

  const TIME_LIMIT = 30000; // 30 giây

  // ==========================================================================
  // 2. KHỞI TẠO VÀ ĐIỀU PHỐI GIAO DIỆN
  // ==========================================================================
  document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isTeacherView = urlParams.get("view") === "teacher";

    if (isTeacherView) {
      initTeacherView();
    } else {
      initStudentView();
    }
  });

  // ==========================================================================
  // 3. LOGIC GIÁO VIÊN (TEACHER VIEW)
  // ==========================================================================
  let teacherRealtimeChannel = null;
  let currentLeaderboard = [];

  function initTeacherView() {
    const teacherView = document.getElementById("teacher-view");
    const studentView = document.getElementById("student-view");
    if (teacherView) {
      teacherView.classList.remove("hidden");
      teacherView.classList.add("flex");
    }
    if (studentView) {
      studentView.classList.add("hidden");
      studentView.classList.remove("flex");
    }

    // URL học sinh quét QR
    const studentUrl = window.location.origin + window.location.pathname;
    const urlDisplay = document.getElementById("student-join-url");
    if (urlDisplay) urlDisplay.innerText = studentUrl;

    // Tạo QR Code
    const qrContainer = document.getElementById("qrcode-container");
    if (qrContainer && window.QRCode) {
      qrContainer.innerHTML = "";
      new QRCode(qrContainer, {
        text: studentUrl,
        width: 200,
        height: 200,
        colorDark: "#0f172a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    }

    if (!isSupabaseConfigured) {
      const badge = document.getElementById("teacher-status-badge");
      if (badge) {
        badge.innerHTML = `<span class="w-3 h-3 rounded-full bg-amber-400"></span><span class="text-xs font-semibold text-amber-300">Chế độ Demo (Chưa cấu hình Supabase)</span>`;
      }
    }

    setupTeacherRealtime();

    const btnStart = document.getElementById("btn-start-quiz");
    if (btnStart) {
      btnStart.addEventListener("click", () => {
        document.getElementById("teacher-lobby").classList.add("hidden");
        const board = document.getElementById("teacher-leaderboard");
        board.classList.remove("hidden");
        board.classList.add("flex");
        fetchInitialLeaderboard();
      });
    }

    const btnReset = document.getElementById("btn-reset-session");
    if (btnReset) {
      btnReset.addEventListener("click", async () => {
        if (confirm("Thầy/Cô có chắc chắn muốn xóa toàn bộ kết quả của phiên chơi này không?")) {
          if (sbClient) {
            await sbClient.from("leaderboard").delete().neq("student_name", "");
          }
          localStorage.removeItem("chem_demo_leaderboard");
          currentLeaderboard = [];
          renderLeaderboard([]);
          document.getElementById("connected-count").innerText = "0";
        }
      });
    }
  }

  function sortLeaderboard(list) {
    if (!Array.isArray(list)) return [];
    return list.slice().sort((a, b) => {
      const scoreA = Number(a.score) || 0;
      const scoreB = Number(b.score) || 0;
      if (scoreB !== scoreA) {
        return scoreB - scoreA; // Điểm cao hơn luôn đứng trước (Hạng 1)
      }
      const timeA = new Date(a.last_answered_at || 0).getTime();
      const timeB = new Date(b.last_answered_at || 0).getTime();
      return timeA - timeB; // Cùng điểm thì ai xong trước xếp trước
    });
  }

  async function setupTeacherRealtime() {
    if (!sbClient) {
      // Demo mode: lắng nghe storage
      const checkStorage = () => {
        const local = localStorage.getItem("chem_demo_leaderboard");
        if (local) {
          try {
            const list = JSON.parse(local);
            currentLeaderboard = sortLeaderboard(list);
            const countEl = document.getElementById("connected-count");
            if (countEl) countEl.innerText = list.length;
            renderLeaderboard(currentLeaderboard);
          } catch (_) {}
        }
      };

      window.addEventListener("storage", checkStorage);
      setInterval(checkStorage, 1500); // Polling nhẹ cho tab nội bộ
      checkStorage();
      return;
    }

    const { count } = await sbClient.from("leaderboard").select("*", { count: "exact", head: true });
    const countEl = document.getElementById("connected-count");
    if (countEl) countEl.innerText = count || 0;

    teacherRealtimeChannel = sbClient
      .channel("public:leaderboard")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "leaderboard" }, payload => {
        const cElem = document.getElementById("connected-count");
        if (cElem) cElem.innerText = parseInt(cElem.innerText || "0") + 1;
        upsertLeaderboardState(payload.new);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "leaderboard" }, payload => {
        upsertLeaderboardState(payload.new);
      })
      .subscribe();
  }

  async function fetchInitialLeaderboard() {
    if (!sbClient) {
      const local = localStorage.getItem("chem_demo_leaderboard");
      if (local) {
        currentLeaderboard = sortLeaderboard(JSON.parse(local));
        renderLeaderboard(currentLeaderboard);
      }
      return;
    }

    const { data, error } = await sbClient
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .order("last_answered_at", { ascending: true })
      .limit(5);

    if (!error && data) {
      currentLeaderboard = sortLeaderboard(data);
      renderLeaderboard(currentLeaderboard);
    }
  }

  function upsertLeaderboardState(record) {
    const index = currentLeaderboard.findIndex(item => item.id === record.id);
    if (index !== -1) {
      currentLeaderboard[index] = record;
    } else {
      currentLeaderboard.push(record);
    }

    currentLeaderboard = sortLeaderboard(currentLeaderboard);
    renderLeaderboard(currentLeaderboard);
  }

  function renderLeaderboard(list) {
    const container = document.getElementById("leaderboard-list");
    if (!container) return;

    const sortedList = sortLeaderboard(list).slice(0, 5);

    if (sortedList.length === 0) {
      container.innerHTML = `
        <div class="text-center py-12 text-slate-500 text-sm">
          Chưa có dữ liệu học sinh trả lời...
        </div>`;
      return;
    }

    const medals = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
    const rankColors = [
      "from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300",
      "from-slate-400/20 to-slate-500/10 border-slate-400/40 text-slate-200",
      "from-amber-700/20 to-amber-800/10 border-amber-700/40 text-amber-400",
      "from-slate-800 to-slate-800/60 border-slate-700 text-slate-300",
      "from-slate-800 to-slate-800/60 border-slate-700 text-slate-300"
    ];

    container.innerHTML = sortedList.map((student, idx) => {
      return `
        <div class="leaderboard-item flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r ${rankColors[idx] || rankColors[3]} border backdrop-blur-md shadow-md">
          <div class="flex items-center gap-4">
            <span class="text-2xl">${medals[idx] || "⭐"}</span>
            <div>
              <h4 class="font-bold text-lg text-white">${escapeHtml(student.student_name)}</h4>
              <span class="text-xs text-slate-400">Cập nhật: ${new Date(student.last_answered_at).toLocaleTimeString("vi-VN")}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-2xl font-black font-['JetBrains_Mono'] tracking-tight text-cyan-300">${Number(student.score).toLocaleString()}</span>
            <span class="text-xs text-slate-400 block">điểm</span>
          </div>
        </div>
      `;
    }).join("");
  }

  // ==========================================================================
  // 4. LOGIC HỌC SINH (STUDENT VIEW)
  // ==========================================================================
  let currentQuestionIndex = 0;
  let questionStartTime = 0;
  let timerAnimationFrame = null;
  let currentTotalScore = 0;
  let currentStudentId = null;
  let currentStudentName = "";

  function initStudentView() {
    const studentView = document.getElementById("student-view");
    const teacherView = document.getElementById("teacher-view");
    if (studentView) {
      studentView.classList.remove("hidden");
      studentView.classList.add("flex");
    }
    if (teacherView) {
      teacherView.classList.add("hidden");
      teacherView.classList.remove("flex");
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("new") === "true") {
      sessionStorage.removeItem("chem_student_id");
      sessionStorage.removeItem("chem_student_name");
      sessionStorage.removeItem("chem_student_score");
      sessionStorage.removeItem("chem_current_index");
    }

    const savedStudentId = sessionStorage.getItem("chem_student_id");
    const savedStudentName = sessionStorage.getItem("chem_student_name");
    const savedQuestionIndex = sessionStorage.getItem("chem_current_index");
    const savedScore = sessionStorage.getItem("chem_student_score");

    if (savedStudentId && savedStudentName) {
      currentStudentId = savedStudentId;
      currentStudentName = savedStudentName;
      currentQuestionIndex = savedQuestionIndex ? parseInt(savedQuestionIndex) : 0;
      currentTotalScore = savedScore ? parseInt(savedScore) : 0;

      if (currentQuestionIndex >= QUESTIONS.length) {
        showFinishedScreen();
      } else {
        showScreen("student-screen-question");
        loadQuestion(currentQuestionIndex);
      }
    } else {
      showScreen("student-screen-name");
    }

    const formJoin = document.getElementById("form-join");
    if (formJoin) {
      formJoin.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("input-student-name").value.trim();
        if (!nameInput) return;

        const btnSubmit = document.getElementById("btn-join-submit");
        if (btnSubmit) {
          btnSubmit.disabled = true;
          btnSubmit.innerText = "Đang kết nối...";
        }

        currentStudentName = nameInput;
        currentStudentId = "id_" + Math.random().toString(36).substring(2, 9);

        if (sbClient) {
          try {
            const { data, error } = await sbClient
              .from("leaderboard")
              .insert([{ student_name: currentStudentName, score: 0 }])
              .select()
              .single();

            if (!error && data) {
              currentStudentId = data.id;
            }
          } catch (err) {
            console.warn("Lỗi khi kết nối Supabase:", err);
          }
        } else {
          // Lưu vào demo leaderboard để giáo viên xem
          const demoList = JSON.parse(localStorage.getItem("chem_demo_leaderboard") || "[]");
          demoList.push({
            id: currentStudentId,
            student_name: currentStudentName,
            score: 0,
            last_answered_at: new Date().toISOString()
          });
          localStorage.setItem("chem_demo_leaderboard", JSON.stringify(demoList));
        }

        sessionStorage.setItem("chem_student_id", currentStudentId);
        sessionStorage.setItem("chem_student_name", currentStudentName);
        sessionStorage.setItem("chem_student_score", "0");
        sessionStorage.setItem("chem_current_index", "0");

        showScreen("student-screen-question");
        loadQuestion(0);
      });
    }

    const btnNext = document.getElementById("btn-next-question");
    if (btnNext) {
      btnNext.addEventListener("click", () => {
        currentQuestionIndex++;
        sessionStorage.setItem("chem_current_index", currentQuestionIndex);

        if (currentQuestionIndex < QUESTIONS.length) {
          showScreen("student-screen-question");
          loadQuestion(currentQuestionIndex);
        } else {
          showFinishedScreen();
        }
      });
    }

    const btnRestart = document.getElementById("btn-restart-student");
    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        resetStudentSession();
      });
    }
  }

  function resetStudentSession() {
    sessionStorage.removeItem("chem_student_id");
    sessionStorage.removeItem("chem_student_name");
    sessionStorage.removeItem("chem_student_score");
    sessionStorage.removeItem("chem_current_index");
    currentStudentId = null;
    currentStudentName = "";
    currentQuestionIndex = 0;
    currentTotalScore = 0;

    const nameInput = document.getElementById("input-student-name");
    if (nameInput) {
      nameInput.value = "";
    }
    const btnSubmit = document.getElementById("btn-join-submit");
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerText = "Vào Trận Đấu";
    }
    showScreen("student-screen-name");
  }

  function showScreen(screenId) {
    const screens = [
      "student-screen-name",
      "student-screen-question",
      "student-screen-feedback",
      "student-screen-finished"
    ];
    screens.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === screenId) {
          el.classList.remove("hidden");
          el.classList.add("flex", "flex-col");
        } else {
          el.classList.add("hidden");
          el.classList.remove("flex", "flex-col");
        }
      }
    });
  }

  function loadQuestion(index) {
    const q = QUESTIONS[index];
    document.getElementById("question-progress").innerText = `Câu ${index + 1}/${QUESTIONS.length}`;
    document.getElementById("student-current-score").innerText = currentTotalScore.toLocaleString();
    document.getElementById("question-text").innerText = q.question;

    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "w-full text-left p-4 bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 active:text-white border border-slate-700 rounded-2xl text-slate-200 font-semibold text-base transition-all transform active:scale-98 shadow-sm flex items-center";
      btn.innerHTML = `<span class="inline-block w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center mr-3 font-bold text-sm text-cyan-400">${String.fromCharCode(65 + optIdx)}</span> ${escapeHtml(optText)}`;
      
      btn.addEventListener("click", () => handleSelectAnswer(optIdx));
      optionsContainer.appendChild(btn);
    });

    startTimer();
  }

  function startTimer() {
    cancelAnimationFrame(timerAnimationFrame);
    questionStartTime = Date.now();
    const progressBar = document.getElementById("time-progress-bar");

    function update() {
      const now = Date.now();
      const elapsed = now - questionStartTime;
      const remaining = Math.max(0, TIME_LIMIT - elapsed);
      const percentage = (remaining / TIME_LIMIT) * 100;

      if (progressBar) {
        progressBar.style.width = `${percentage}%`;

        if (percentage > 50) {
          progressBar.className = "h-full rounded-full bg-emerald-400 transition-all duration-75";
        } else if (percentage > 20) {
          progressBar.className = "h-full rounded-full bg-amber-400 transition-all duration-75";
        } else {
          progressBar.className = "h-full rounded-full bg-rose-500 timer-urgent transition-all duration-75";
        }
      }

      if (remaining > 0) {
        timerAnimationFrame = requestAnimationFrame(update);
      } else {
        handleSelectAnswer(-1);
      }
    }

    timerAnimationFrame = requestAnimationFrame(update);
  }

  async function handleSelectAnswer(selectedIndex) {
    cancelAnimationFrame(timerAnimationFrame);

    const buttons = document.querySelectorAll("#options-container button");
    buttons.forEach(b => (b.disabled = true));

    const currentQ = QUESTIONS[currentQuestionIndex];
    const isCorrect = selectedIndex === currentQ.correct;

    const timeTaken = Date.now() - questionStartTime;
    const remainingTime = Math.max(0, TIME_LIMIT - timeTaken);
    const bonusScore = Math.floor((remainingTime / TIME_LIMIT) * 1000);
    const totalQuestionScore = isCorrect ? (1000 + bonusScore) : 0;

    currentTotalScore += totalQuestionScore;
    sessionStorage.setItem("chem_student_score", currentTotalScore.toString());

    if (sbClient && currentStudentId) {
      try {
        await sbClient
          .from("leaderboard")
          .update({
            score: currentTotalScore,
            last_answered_at: new Date().toISOString()
          })
          .eq("id", currentStudentId);
      } catch (err) {
        console.warn("Lỗi khi cập nhật điểm:", err);
      }
    } else {
      const demoList = JSON.parse(localStorage.getItem("chem_demo_leaderboard") || "[]");
      const item = demoList.find(i => i.id === currentStudentId);
      if (item) {
        item.score = currentTotalScore;
        item.last_answered_at = new Date().toISOString();
        localStorage.setItem("chem_demo_leaderboard", JSON.stringify(demoList));
      }
    }

    showFeedbackScreen(isCorrect, totalQuestionScore, currentQ.explanation);
  }

  function showFeedbackScreen(isCorrect, scoreGained, explanation) {
    showScreen("student-screen-feedback");

    const iconBox = document.getElementById("feedback-icon-box");
    const title = document.getElementById("feedback-title");
    const scoreText = document.getElementById("feedback-score-gained");
    const expText = document.getElementById("feedback-explanation");
    const totalScoreElem = document.getElementById("student-total-score");

    if (isCorrect) {
      iconBox.className = "w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 border-2 bg-emerald-500/20 border-emerald-500 text-emerald-400";
      iconBox.innerHTML = "✓";
      title.innerText = "CHÍNH XÁC!";
      title.className = "text-2xl font-black mb-1 text-emerald-400";
      scoreText.innerText = `+${scoreGained.toLocaleString()} điểm (Bao gồm điểm tốc độ)`;
      
      if (window.confetti) {
        window.confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      iconBox.className = "w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 border-2 bg-rose-500/20 border-rose-500 text-rose-400";
      iconBox.innerHTML = "✗";
      title.innerText = "CHƯA CHÍNH XÁC!";
      title.className = "text-2xl font-black mb-1 text-rose-400";
      scoreText.innerText = "+0 điểm";
    }

    expText.innerText = explanation;
    totalScoreElem.innerText = currentTotalScore.toLocaleString();
  }

  function showFinishedScreen() {
    showScreen("student-screen-finished");
    document.getElementById("final-student-score").innerText = currentTotalScore.toLocaleString();

    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });
    }
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
})();
