let followers = 120;
let isFollowing = false;
let postCount = 0;
let uploadedImageData = null;

// ── Follow / Unfollow ──────────────────────────────────────────
function followUser() {
  isFollowing = !isFollowing;
  if (isFollowing) {
    followers++;
    document.getElementById("followBtn").textContent = "✓ Following";
    document.getElementById("followBtn").classList.add("following");
  } else {
    followers--;
    document.getElementById("followBtn").textContent = "Follow";
    document.getElementById("followBtn").classList.remove("following");
  }
  document.getElementById("followers").textContent = followers;
}

// ── Dark Mode ──────────────────────────────────────────────────
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// ── Image Preview ──────────────────────────────────────────────
function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    uploadedImageData = e.target.result;
    const preview = document.getElementById("imagePreview");
    preview.src = uploadedImageData;
    preview.style.display = "block";
  };
  reader.readAsDataURL(file);
}

// ── Create Post ────────────────────────────────────────────────
function createPost() {
  const text = document.getElementById("postText").value;
  if (text.trim() === "" && !uploadedImageData) {
    alert("Write something or add an image first!");
    return;
  }

  const postId = Date.now();
  postCount++;
  document.getElementById("postsCount").textContent = postCount;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const imgHTML = uploadedImageData
    ? `<img class="post-image" src="${uploadedImageData}" alt="Post image">`
    : `<img class="post-image" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800" alt="Post image">`;

  const postHTML = `
    <div class="post card" id="post-${postId}">
      <div class="post-header">
        <img src="https://i.pravatar.cc/150?img=32" class="post-avatar" alt="avatar">
        <div>
          <strong>Bhavna Saini</strong>
          <span class="post-time">${timeStr}</span>
        </div>
      </div>

      ${text ? `<p class="post-text">${text}</p>` : ""}
      ${imgHTML}

      <div class="post-stats">
        <span id="likeCount-${postId}">0 Likes</span>
        <span id="commentCount-${postId}">0 Comments</span>
      </div>

      <div class="post-btns">
        <button class="like-btn" id="likeBtn-${postId}" onclick="likePost(${postId})">❤️ Like</button>
        <button class="comment-toggle-btn" onclick="toggleComments(${postId})">💬 Comment</button>
      </div>

      <div class="comment-section" id="commentSection-${postId}" style="display:none;">
        <div id="comments-${postId}" class="comments-list"></div>
        <div class="comment-input-row">
          <input
            type="text"
            id="commentInput-${postId}"
            class="comment-input"
            placeholder="Write a comment..."
            onkeydown="if(event.key==='Enter') addComment(${postId})"
          >
          <button class="send-btn" onclick="addComment(${postId})">Send</button>
        </div>
      </div>
    </div>
  `;

  document.getElementById("posts").insertAdjacentHTML("afterbegin", postHTML);
  document.getElementById("postText").value = "";
  document.getElementById("imagePreview").style.display = "none";
  uploadedImageData = null;
  document.getElementById("imageUpload").value = "";
}

// ── Like Post ──────────────────────────────────────────────────
const likedPosts = new Set();

function likePost(postId) {
  const btn = document.getElementById(`likeBtn-${postId}`);
  const countEl = document.getElementById(`likeCount-${postId}`);
  let likes = parseInt(countEl.textContent) || 0;

  if (likedPosts.has(postId)) {
    likedPosts.delete(postId);
    likes--;
    btn.classList.remove("liked");
    btn.textContent = "❤️ Like";
  } else {
    likedPosts.add(postId);
    likes++;
    btn.classList.add("liked");
    btn.textContent = "❤️ Liked";
  }

  countEl.textContent = `${likes} Like${likes !== 1 ? "s" : ""}`;
}

// ── Toggle Comments ────────────────────────────────────────────
function toggleComments(postId) {
  const section = document.getElementById(`commentSection-${postId}`);
  section.style.display = section.style.display === "none" ? "block" : "none";
  if (section.style.display === "block") {
    document.getElementById(`commentInput-${postId}`).focus();
  }
}

// ── Add Comment ────────────────────────────────────────────────
const commentCounts = {};

function addComment(postId) {
  const input = document.getElementById(`commentInput-${postId}`);
  const text = input.value.trim();
  if (!text) return;

  const commentsList = document.getElementById(`comments-${postId}`);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  commentsList.innerHTML += `
    <div class="comment">
      <img src="https://i.pravatar.cc/32?img=12" class="comment-avatar" alt="commenter">
      <div class="comment-body">
        <strong>You</strong> <span class="comment-time">${timeStr}</span>
        <p>${text}</p>
      </div>
    </div>
  `;

  commentCounts[postId] = (commentCounts[postId] || 0) + 1;
  document.getElementById(`commentCount-${postId}`).textContent =
    `${commentCounts[postId]} Comment${commentCounts[postId] !== 1 ? "s" : ""}`;

  input.value = "";
  commentsList.scrollTop = commentsList.scrollHeight;
}