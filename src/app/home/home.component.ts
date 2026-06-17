import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink],
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  navbarOpen = false;

  // ========== AUTHENTICATION PROPERTIES ==========
  isLoggedIn = false;
  user: any = null;
  showLoginPrompt = false;

  // ========== DROPDOWN PROPERTIES ==========
  dropdownOpen = false;
  userCredits: any = null;

  // ========== BACKEND API URL ==========
  private readonly BACKEND_URL = 'http://localhost:8080/api';
  private readonly API_URL = 'https://shkahmed-backend.hf.space';

  @ViewChild('originalVideo') originalVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('translatedVideo') translatedVideo!: ElementRef<HTMLVideoElement>;

  originalVideoPlaying = false;
  translatedVideoPlaying = false;

  features = [
    { icon: 'fas fa-volume-up', title: 'Text-to-Speech (TTS)', description: 'Convert any text into natural speech with multiple voices.', badge: '5+ Voices', type: 'tts' },
    { icon: 'fas fa-clone', title: 'Voice Cloning', description: 'Clone any voice with just 10 seconds of audio.', badge: '10s Sample', type: 'cloning' },
    { icon: 'fas fa-smile', title: 'Emotion TTS', description: 'Generate speech with 12 different emotions.', badge: '12 Emotions', type: 'emotion' },
    { icon: 'fas fa-microphone', title: 'Speech-to-Text', description: 'Transcribe audio with high accuracy.', badge: '98% Accuracy', type: 'stt' },
    { icon: 'fas fa-video', title: 'Video Translation', description: 'Translate video audio to 50+ languages with AI dubbing.', badge: '50+ Languages', type: 'video' },
    { icon: 'fas fa-bolt', title: 'Temporary Voice', description: 'Test with any voice without saving.', badge: 'Instant', type: 'temp' }
  ];

  emotions = [
    { id: 'happy', name: 'Happy', emoji: '😊' },
    { id: 'sad', name: 'Sad', emoji: '😢' },
    { id: 'angry', name: 'Angry', emoji: '😠' },
    { id: 'excited', name: 'Excited', emoji: '🤩' },
    { id: 'calm', name: 'Calm', emoji: '😌' },
    { id: 'fearful', name: 'Fearful', emoji: '😨' },
    { id: 'surprised', name: 'Surprised', emoji: '😲' },
    { id: 'neutral', name: 'Neutral', emoji: '😐' },
    { id: 'friendly', name: 'Friendly', emoji: '🤝' },
    { id: 'authoritative', name: 'Authoritative', emoji: '👔' },
    { id: 'whisper', name: 'Whisper', emoji: '🤫' },
    { id: 'narrative', name: 'Narrative', emoji: '📖' }
  ];

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' }
  ];

  pricingPlans = [
    {
      name: 'Credit Pack',
      price: '$0.95',
      period: 'One-time',
      icon: 'fas fa-coins',
      badge: 'Best Value',
      popular: false,
      link: '#',
      btnText: 'Buy Now',
      btnIcon: 'fas fa-shopping-cart',
      action: 'purchaseCredits',
      features: ['200 Credits', '200 Audio Generations', 'No Expiry', 'Basic Support']
    },
    {
      name: 'Monthly Plan',
      price: '$5.99',
      period: '/month',
      icon: 'fas fa-calendar-alt',
      badge: '⭐ POPULAR',
      popular: true,
      link: '#',
      btnText: 'Subscribe',
      btnIcon: 'fas fa-calendar-plus',
      action: 'subscribePlan',
      features: ['1,800 Credits/Month', '1,800 Audio Generations', 'Auto-renews monthly', 'Cancel anytime', 'Priority Support']
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      icon: 'fas fa-building',
      badge: '',
      popular: false,
      link: '#contact',
      btnText: 'Contact Sales',
      btnIcon: 'fas fa-envelope',
      action: 'scrollToContact',
      features: ['Unlimited Generations', 'Custom Voice Cloning', 'Dedicated Support', 'SLA Guarantee', 'API Access']
    }
  ];

  speakerList: { name: string; language: string; languageName: string }[] = [];
  isLoadingSpeakers = false;

  // Card 1: Simple TTS
  simpleTtsText = "";
  selectedSimpleSpeaker = '';
  simpleTtsLanguage = 'en';
  isGeneratingSimple = false;
  simpleTtsStatus = '';
  simpleTtsAudioUrl: string | null = null;
  simpleTtsAudioBlob: Blob | null = null;

  // Card 2: Emotion TTS
  emotionTtsText = "I am so excited to see you today!";
  selectedEmotionSpeaker = '';
  selectedEmotion = 'happy';
  emotionTtsLanguage = 'en';
  emotionSpeed = 1.0;
  emotionPitch = 1.0;
  isGeneratingEmotion = false;
  emotionTtsStatus = '';
  emotionTtsAudioUrl: string | null = null;
  emotionTtsAudioBlob: Blob | null = null;

  // Card 3: Voice Cloning
  newSpeakerName = '';
  newSpeakerLanguage = 'en';
  selectedCloneSpeaker = '';
  cloneText = 'Hello, this is my cloned voice. Amazing, isn\'t it?';
  cloneLanguage = 'en';
  isUploading = false;
  isCloning = false;
  uploadStatus = '';
  cloneStatus = '';
  cloneAudioUrl: string | null = null;
  cloneAudioBlob: Blob | null = null;
  selectedFile: File | null = null;
  selectedFileName = '';

  // Card 4: Temporary TTS
  tempText = 'This is a quick test with a temporary voice.';
  tempLanguage = 'en';
  tempFile: File | null = null;
  isGeneratingTemp = false;
  tempStatus = '';
  tempAudioUrl: string | null = null;
  tempAudioBlob: Blob | null = null;

  // STT Properties
  isRecording = false;
  sttResult = '';
  mediaRecorder: any;
  audioChunks: any[] = [];

  // Contact Properties
  contactName = '';
  contactEmail = '';
  contactMessage = '';
  newsletterEmail = '';

  // Card 5: Video Language Translation
  selectedVideoFileName = '';
  videoSourceLanguage = 'auto';
  videoTargetLanguage = '';
  videoPreviewUrl: string | null = null;
  videoDuration = '00:00';
  videoFileSize = '0 MB';
  detectedLanguage = 'en';
  includeSubtitles = true;
  burnSubtitles = false;
  videoVoiceStyle = 'natural';
  isTranslatingVideo = false;
  videoTranslationProgress = 0;
  videoTranslationStatus = '';
  videoTranslationMessage = '';
  translatedVideoUrl: string | null = null;
  translatedVideoSize = '0 MB';
  videoFile: File | null = null;
  simplePlaying = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    import('aos').then(AOS => {
      AOS.init({ duration: 800, once: true });
    });
    this.loadSpeakers();
    this.checkLoginStatus();
  }

  // ========== AUTHENTICATION METHODS ==========
  checkLoginStatus() {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.isLoggedIn = true;
      this.user = JSON.parse(userData);
      console.log('✅ User logged in:', this.user);
      this.fetchUserCredits();
    } else {
      this.isLoggedIn = false;
      this.user = null;
      this.userCredits = null;
      console.log('❌ User not logged in');
    }
  }

  // ========== FETCH USER CREDITS ==========
  fetchUserCredits() {
    if (!this.isLoggedIn || !this.user) return;

    this.http.get(`${this.BACKEND_URL}/credits/balance?email=${this.user.email}`)
      .subscribe({
        next: (response: any) => {
          if (response.success) {
            this.userCredits = response;
            console.log('✅ Credits fetched:', this.userCredits);
          }
        },
        error: (error) => {
          console.error('❌ Failed to fetch credits:', error);
          this.userCredits = { balance: 20, dailyFreeCredits: 20 };
        }
      });
  }

  // ========== CHECK CREDITS BEFORE GENERATION ==========
  checkCredits(actionType: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.BACKEND_URL}/credits/check?email=${this.user.email}&actionType=${actionType}`)
        .subscribe({
          next: (response: any) => {
            if (response.success && response.hasEnough) {
              resolve(true);
            } else {
              this.showError(`⚠️ Insufficient credits! You need ${response.required} credits. Your balance: ${response.balance}`);
              resolve(false);
            }
          },
          error: (error) => {
            console.error('❌ Error checking credits:', error);
            reject(error);
          }
        });
    });
  }

  // ========== DEDUCT CREDITS AFTER GENERATION ==========
  deductCredits(actionType: string, referenceId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.BACKEND_URL}/credits/deduct?email=${this.user.email}&actionType=${actionType}&referenceId=${referenceId}`, {})
        .subscribe({
          next: (response: any) => {
            if (response.success) {
              console.log('✅ Credits deducted:', response);
              // Update local credit balance
              this.userCredits.balance = response.balance;
              resolve(response);
            } else {
              this.showError(`❌ ${response.message}`);
              reject(response);
            }
          },
          error: (error) => {
            console.error('❌ Error deducting credits:', error);
            reject(error);
          }
        });
    });
  }

  // ========== DROPDOWN METHODS ==========
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
    if (this.dropdownOpen) {
      this.fetchUserCredits();
    }
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.profile-wrapper');
    if (dropdown && !dropdown.contains(target)) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    this.isLoggedIn = false;
    this.user = null;
    this.userCredits = null;
    this.dropdownOpen = false;
    window.location.reload();
  }

  // ========== VIDEO METHODS ==========
  playOriginalVideo(event: Event) {
    event.stopPropagation();
    const video = this.originalVideo?.nativeElement;
    if (video) {
      if (video.paused) {
        video.play();
        this.originalVideoPlaying = true;
      } else {
        video.pause();
        this.originalVideoPlaying = false;
      }
    }
  }

  playTranslatedVideo(event: Event) {
    event.stopPropagation();
    const video = this.translatedVideo?.nativeElement;
    if (video) {
      if (video.paused) {
        video.play();
        this.translatedVideoPlaying = true;
      } else {
        video.pause();
        this.translatedVideoPlaying = false;
      }
    }
  }

  onVideoPlay(type: string) {
    if (type === 'original') {
      this.originalVideoPlaying = true;
    } else {
      this.translatedVideoPlaying = true;
    }
  }

  onVideoPause(type: string) {
    if (type === 'original') {
      this.originalVideoPlaying = false;
    } else {
      this.translatedVideoPlaying = false;
    }
  }

  showSuccess(message: string) {
    alert(message);
  }

  showError(message: string) {
    alert(message);
  }

  // ========== VIDEO METHODS ==========
  triggerVideoUpload() {
    const fileInput = document.querySelector('#videoFileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onVideoDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    if (element) {
      element.style.borderColor = '#2563eb';
      element.style.background = 'rgba(37, 99, 235, 0.05)';
    }
  }

  onVideoDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const element = event.currentTarget as HTMLElement;
    if (element) {
      element.style.borderColor = '#bfdbfe';
      element.style.background = 'rgba(37, 99, 235, 0.02)';
    }

    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.processVideoFile(files[0]);
    }
  }

  onVideoFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.processVideoFile(file);
    }
  }

  processVideoFile(file: File) {
    const maxSize = 500 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File size must be less than 500MB');
      return;
    }

    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload MP4, AVI, MOV, or MKV files');
      return;
    }

    this.videoFile = file;
    this.selectedVideoFileName = file.name;
    this.videoFileSize = this.formatFileSize(file.size);

    this.videoPreviewUrl = URL.createObjectURL(file);

    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      const duration = video.duration;
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      this.videoDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    video.src = URL.createObjectURL(file);
  }

  shareAudio() {
    if (this.simpleTtsAudioUrl) {
      alert('Share link copied to clipboard!');
    }
  }

  selectVideoTargetLanguage(langCode: string) {
    this.videoTargetLanguage = langCode;
  }

  async translateVideo() {
    if (!this.videoFile || !this.videoTargetLanguage) {
      alert('Please upload a video and select target language');
      return;
    }

    // Check credits first
    try {
      const hasCredits = await this.checkCredits('VIDEO');
      if (!hasCredits) return;
    } catch (error) {
      this.showError('Failed to check credits. Please try again.');
      return;
    }

    this.isTranslatingVideo = true;
    this.videoTranslationProgress = 0;
    this.videoTranslationStatus = 'Starting translation...';
    this.videoTranslationMessage = 'Starting video translation process...';

    try {
      const formData = new FormData();
      formData.append('video', this.videoFile);
      formData.append('source_language', this.videoSourceLanguage);
      formData.append('target_language', this.videoTargetLanguage);
      formData.append('include_subtitles', this.includeSubtitles.toString());
      formData.append('burn_subtitles', this.burnSubtitles.toString());
      formData.append('voice_style', this.videoVoiceStyle);

      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        this.videoTranslationProgress = i;

        if (i < 30) {
          this.videoTranslationStatus = 'Analyzing video...';
        } else if (i < 60) {
          this.videoTranslationStatus = 'Transcribing audio...';
        } else if (i < 90) {
          this.videoTranslationStatus = 'Generating translated audio...';
        } else {
          this.videoTranslationStatus = 'Finalizing video...';
        }
      }

      this.videoTranslationProgress = 100;
      this.videoTranslationStatus = 'Complete!';
      this.videoTranslationMessage = 'Video translated successfully!';

      // Deduct credits after successful generation
      try {
        await this.deductCredits('VIDEO', Date.now().toString());
        this.showSuccess('✅ Video translated successfully! Credits deducted.');
      } catch (error) {
        console.error('Credit deduction failed:', error);
      }

    } catch (error: any) {
      console.error('Video translation error:', error);
      this.videoTranslationMessage = `Translation failed: ${error.message}`;
    } finally {
      this.isTranslatingVideo = false;
    }
  }

  downloadTranslatedVideo() {
    if (this.translatedVideoUrl) {
      const a = document.createElement('a');
      a.href = this.translatedVideoUrl;
      a.download = `translated_video_${Date.now()}.mp4`;
      a.click();
    }
  }

  previewTranslatedVideo() {
    if (this.translatedVideoUrl) {
      window.open(this.translatedVideoUrl, '_blank');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  togglePlaySimple() {
    this.simplePlaying = !this.simplePlaying;
  }

  // ========== NAVIGATION METHODS ==========
  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen;
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.navbarOpen = false;
    }
  }

  scrollToDemo(type: string) {
    this.scrollTo('demo');
  }

  // ========== SPEAKER METHODS ==========
  getLanguageName(langCode: string): string {
    const lang = this.languages.find(l => l.code === langCode);
    return lang ? lang.name : 'Unknown';
  }

  getFilteredSpeakers(languageCode: string) {
    return this.speakerList.filter(speaker => speaker.language === languageCode);
  }

  async loadSpeakers() {
    this.isLoadingSpeakers = true;
    try {
      const response: any = await this.http.get(`${this.API_URL}/speakers/list`).toPromise();
      if (response && response.speakers) {
        this.speakerList = Object.keys(response.speakers).map(name => ({
          name: name,
          language: response.speakers[name].language || 'en',
          languageName: response.speakers[name].language_name || 'English'
        }));

        this.updateDefaultSelections();
      }
    } catch (error) {
      console.error('Failed to load speakers:', error);
    } finally {
      this.isLoadingSpeakers = false;
    }
  }

  updateDefaultSelections() {
    const englishSpeakers = this.getFilteredSpeakers('en');
    const hindiSpeakers = this.getFilteredSpeakers('hi');

    if (this.simpleTtsLanguage === 'en' && englishSpeakers.length > 0 && !this.selectedSimpleSpeaker) {
      this.selectedSimpleSpeaker = englishSpeakers[0].name;
    } else if (this.simpleTtsLanguage === 'hi' && hindiSpeakers.length > 0 && !this.selectedSimpleSpeaker) {
      this.selectedSimpleSpeaker = hindiSpeakers[0].name;
    }

    if (this.emotionTtsLanguage === 'en' && englishSpeakers.length > 0 && !this.selectedEmotionSpeaker) {
      this.selectedEmotionSpeaker = englishSpeakers[0].name;
    } else if (this.emotionTtsLanguage === 'hi' && hindiSpeakers.length > 0 && !this.selectedEmotionSpeaker) {
      this.selectedEmotionSpeaker = hindiSpeakers[0].name;
    }

    if (this.cloneLanguage === 'en' && englishSpeakers.length > 0 && !this.selectedCloneSpeaker) {
      this.selectedCloneSpeaker = englishSpeakers[0].name;
    } else if (this.cloneLanguage === 'hi' && hindiSpeakers.length > 0 && !this.selectedCloneSpeaker) {
      this.selectedCloneSpeaker = hindiSpeakers[0].name;
    }
  }

  onSimpleLanguageChange() {
    const speakers = this.getFilteredSpeakers(this.simpleTtsLanguage);
    if (speakers.length > 0) {
      this.selectedSimpleSpeaker = speakers[0].name;
    } else {
      this.selectedSimpleSpeaker = '';
    }
  }

  onEmotionLanguageChange() {
    const speakers = this.getFilteredSpeakers(this.emotionTtsLanguage);
    if (speakers.length > 0) {
      this.selectedEmotionSpeaker = speakers[0].name;
    } else {
      this.selectedEmotionSpeaker = '';
    }
  }

  onCloneLanguageChange() {
    const speakers = this.getFilteredSpeakers(this.cloneLanguage);
    if (speakers.length > 0) {
      this.selectedCloneSpeaker = speakers[0].name;
    } else {
      this.selectedCloneSpeaker = '';
    }
  }

  selectSimpleSpeaker(speakerName: string) {
    this.selectedSimpleSpeaker = speakerName;
  }

  selectEmotionSpeaker(speakerName: string) {
    this.selectedEmotionSpeaker = speakerName;
  }

  selectCloneSpeaker(speakerName: string) {
    this.selectedCloneSpeaker = speakerName;
  }

  selectEmotion(emotionId: string) {
    this.selectedEmotion = emotionId;
  }

  // ========== TTS METHODS WITH CREDIT CHECK ==========

  async generateSimpleTTS() {
    if (!this.isLoggedIn) {
      this.showError('🔒 Please login to generate audio. Click the "Login / Sign Up" button above.');
      return;
    }

    if (!this.simpleTtsText.trim()) {
      alert('Please enter some text');
      return;
    }
    if (!this.selectedSimpleSpeaker) {
      alert(`Please select a ${this.getLanguageName(this.simpleTtsLanguage)} speaker`);
      return;
    }

    // Check credits first
    try {
      const hasCredits = await this.checkCredits('TTS');
      if (!hasCredits) return;
    } catch (error) {
      this.showError('Failed to check credits. Please try again.');
      return;
    }

    this.isGeneratingSimple = true;
    this.simpleTtsStatus = 'Generating speech...';

    try {
      const formData = new FormData();
      formData.append('text', this.simpleTtsText);
      formData.append('language', this.simpleTtsLanguage);
      formData.append('speaker_name', this.selectedSimpleSpeaker);

      if (this.user) {
        formData.append('user_id', this.user.id);
        formData.append('user_email', this.user.email);
      }

      const response = await this.http.post(`${this.API_URL}/synthesize`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.simpleTtsAudioBlob = response.body;
        this.simpleTtsAudioUrl = URL.createObjectURL(this.simpleTtsAudioBlob);
        this.simpleTtsStatus = '✅ Audio generated successfully!';

        const audio = new Audio(this.simpleTtsAudioUrl);
        audio.play();

        // Deduct credits after successful generation
        try {
          await this.deductCredits('TTS', Date.now().toString());
          this.showSuccess('✅ Audio generated! Credits deducted.');
        } catch (error) {
          console.error('Credit deduction failed:', error);
        }
      }
    } catch (error: any) {
      console.error('Simple TTS Error:', error);
      this.simpleTtsStatus = `❌ Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingSimple = false;
    }
  }

  downloadSimpleAudio() {
    if (this.simpleTtsAudioBlob && this.simpleTtsAudioUrl) {
      const a = document.createElement('a');
      a.href = this.simpleTtsAudioUrl;
      a.download = `simple_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // Card 2: Emotion TTS
  async generateEmotionTTS() {
    if (!this.isLoggedIn) {
      this.showError('🔒 Please login to generate audio. Click the "Login / Sign Up" button above.');
      return;
    }

    if (!this.emotionTtsText.trim()) {
      alert('Please enter some text');
      return;
    }
    if (!this.selectedEmotionSpeaker) {
      alert(`Please select a ${this.getLanguageName(this.emotionTtsLanguage)} speaker`);
      return;
    }

    // Check credits first
    try {
      const hasCredits = await this.checkCredits('EMOTION_TTS');
      if (!hasCredits) return;
    } catch (error) {
      this.showError('Failed to check credits. Please try again.');
      return;
    }

    this.isGeneratingEmotion = true;
    this.emotionTtsStatus = 'Generating emotional speech...';

    try {
      const formData = new FormData();
      formData.append('text', this.emotionTtsText);
      formData.append('language', this.emotionTtsLanguage);
      formData.append('emotion', this.selectedEmotion);
      formData.append('speaker_name', this.selectedEmotionSpeaker);
      formData.append('speed', this.emotionSpeed.toString());
      formData.append('pitch', this.emotionPitch.toString());

      if (this.user) {
        formData.append('user_id', this.user.id);
        formData.append('user_email', this.user.email);
      }

      const response = await this.http.post(`${this.API_URL}/synthesize-with-emotion`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.emotionTtsAudioBlob = response.body;
        this.emotionTtsAudioUrl = URL.createObjectURL(this.emotionTtsAudioBlob);
        this.emotionTtsStatus = '✅ Emotional audio generated successfully!';

        const audio = new Audio(this.emotionTtsAudioUrl);
        audio.play();

        try {
          await this.deductCredits('EMOTION_TTS', Date.now().toString());
          this.showSuccess('✅ Emotional audio generated! Credits deducted.');
        } catch (error) {
          console.error('Credit deduction failed:', error);
        }
      }
    } catch (error: any) {
      console.error('Emotion TTS Error:', error);
      this.emotionTtsStatus = `❌ Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingEmotion = false;
    }
  }

  downloadEmotionAudio() {
    if (this.emotionTtsAudioBlob && this.emotionTtsAudioUrl) {
      const a = document.createElement('a');
      a.href = this.emotionTtsAudioUrl;
      a.download = `emotion_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // Card 3: Voice Cloning
  triggerFileUpload() {
    const fileInput = document.querySelector('#fileInput') as HTMLInputElement;
    fileInput?.click();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files[0]) {
      this.selectedFile = files[0];
      this.selectedFileName = this.selectedFile.name;
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name || '';
  }

  async uploadSpeaker() {
    if (!this.isLoggedIn) {
      this.showError('🔒 Please login to upload speakers.');
      return;
    }

    if (!this.selectedFile) {
      alert('Please select a voice file first');
      return;
    }
    if (!this.newSpeakerName.trim()) {
      alert('Please enter a speaker name');
      return;
    }

    this.isUploading = true;
    this.uploadStatus = 'Uploading speaker...';

    try {
      const formData = new FormData();
      formData.append('speaker_name', this.newSpeakerName);
      formData.append('speaker_wav', this.selectedFile);
      formData.append('language', this.newSpeakerLanguage);
      formData.append('description', `Uploaded via UI - ${this.getLanguageName(this.newSpeakerLanguage)} voice`);

      if (this.user) {
        formData.append('user_id', this.user.id);
        formData.append('user_email', this.user.email);
      }

      const response: any = await this.http.post(`${this.API_URL}/speakers/upload`, formData).toPromise();

      if (response && response.status === 'success') {
        this.uploadStatus = `✅ Speaker uploaded successfully with ${this.getLanguageName(this.newSpeakerLanguage)} language!`;
        this.newSpeakerName = '';
        this.selectedFile = null;
        this.selectedFileName = '';
        await this.loadSpeakers();

        if (this.simpleTtsLanguage === this.newSpeakerLanguage) {
          this.onSimpleLanguageChange();
        }
        if (this.emotionTtsLanguage === this.newSpeakerLanguage) {
          this.onEmotionLanguageChange();
        }
        if (this.cloneLanguage === this.newSpeakerLanguage) {
          this.onCloneLanguageChange();
        }

        setTimeout(() => {
          this.uploadStatus = '';
        }, 3000);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      this.uploadStatus = `❌ Upload failed: ${error.message}`;
    } finally {
      this.isUploading = false;
    }
  }

  async generateCloneTTS() {
    if (!this.isLoggedIn) {
      this.showError('🔒 Please login to generate audio.');
      return;
    }

    if (!this.cloneText.trim()) {
      alert('Please enter text to speak');
      return;
    }
    if (!this.selectedCloneSpeaker) {
      alert(`Please select a ${this.getLanguageName(this.cloneLanguage)} speaker`);
      return;
    }

    // Check credits first
    try {
      const hasCredits = await this.checkCredits('CLONE');
      if (!hasCredits) return;
    } catch (error) {
      this.showError('Failed to check credits. Please try again.');
      return;
    }

    this.isCloning = true;
    this.cloneStatus = 'Generating speech with cloned voice...';

    try {
      const formData = new FormData();
      formData.append('text', this.cloneText);
      formData.append('language', this.cloneLanguage);
      formData.append('speaker_name', this.selectedCloneSpeaker);

      if (this.user) {
        formData.append('user_id', this.user.id);
        formData.append('user_email', this.user.email);
      }

      const response = await this.http.post(`${this.API_URL}/synthesize`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.cloneAudioBlob = response.body;
        this.cloneAudioUrl = URL.createObjectURL(this.cloneAudioBlob);
        this.cloneStatus = '✅ Audio generated successfully!';

        const audio = new Audio(this.cloneAudioUrl);
        audio.play();

        try {
          await this.deductCredits('CLONE', Date.now().toString());
          this.showSuccess('✅ Clone audio generated! Credits deducted.');
        } catch (error) {
          console.error('Credit deduction failed:', error);
        }
      }
    } catch (error: any) {
      console.error('Clone TTS Error:', error);
      this.cloneStatus = `❌ Generation failed: ${error.message}`;
    } finally {
      this.isCloning = false;
    }
  }

  downloadCloneAudio() {
    if (this.cloneAudioBlob && this.cloneAudioUrl) {
      const a = document.createElement('a');
      a.href = this.cloneAudioUrl;
      a.download = `cloned_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // Card 4: Temporary TTS
  onTempFileSelected(event: any) {
    this.tempFile = event.target.files[0];
    if (this.tempFile) {
      this.tempStatus = `Selected: ${this.tempFile.name}`;
      setTimeout(() => {
        if (this.tempFile && this.tempStatus === `Selected: ${this.tempFile.name}`) {
          this.tempStatus = '';
        }
      }, 3000);
    }
  }

  async generateTempTTS() {
    if (!this.isLoggedIn) {
      this.showError('🔒 Please login to generate audio.');
      return;
    }

    if (!this.tempText.trim()) {
      alert('Please enter some text');
      return;
    }
    if (!this.tempFile) {
      alert('Please upload a temporary voice file');
      return;
    }

    // Check credits first
    try {
      const hasCredits = await this.checkCredits('TTS');
      if (!hasCredits) return;
    } catch (error) {
      this.showError('Failed to check credits. Please try again.');
      return;
    }

    this.isGeneratingTemp = true;
    this.tempStatus = 'Generating speech with temporary voice...';

    try {
      const formData = new FormData();
      formData.append('text', this.tempText);
      formData.append('language', this.tempLanguage);
      formData.append('speaker_wav', this.tempFile);

      if (this.user) {
        formData.append('user_id', this.user.id);
        formData.append('user_email', this.user.email);
      }

      const response = await this.http.post(`${this.API_URL}/synthesize-temp`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.tempAudioBlob = response.body;
        this.tempAudioUrl = URL.createObjectURL(this.tempAudioBlob);
        this.tempStatus = '✅ Audio generated successfully!';

        const audio = new Audio(this.tempAudioUrl);
        audio.play();

        try {
          await this.deductCredits('TTS', Date.now().toString());
          this.showSuccess('✅ Temporary audio generated! Credits deducted.');
        } catch (error) {
          console.error('Credit deduction failed:', error);
        }
      }
    } catch (error: any) {
      console.error('Temp TTS Error:', error);
      this.tempStatus = `❌ Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingTemp = false;
    }
  }

  downloadTempAudio() {
    if (this.tempAudioBlob && this.tempAudioUrl) {
      const a = document.createElement('a');
      a.href = this.tempAudioUrl;
      a.download = `temp_tts_${Date.now()}.wav`;
      a.click();
    }
  }

  // ========== STT FUNCTIONS ==========
  toggleRecording() {
    if (!this.isLoggedIn) {
      this.showError('🔒 Please login to use speech-to-text.');
      return;
    }

    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.ondataavailable = (event: any) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = async () => {
          this.sttResult = "Transcription would appear here.";
          alert('Recording complete!');
        };

        this.mediaRecorder.start();
        this.isRecording = true;
      })
      .catch(err => {
        alert('Please allow microphone access');
      });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  // ========== CONTACT METHODS ==========
  sendMessage() {
    if (this.contactName && this.contactEmail && this.contactMessage) {
      alert('Thank you for your message! Our team will get back to you soon.');
      this.contactName = '';
      this.contactEmail = '';
      this.contactMessage = '';
    } else {
      alert('Please fill in all fields.');
    }
  }

  subscribeNewsletter() {
    if (this.newsletterEmail) {
      alert(`Subscribed with email: ${this.newsletterEmail}`);
      this.newsletterEmail = '';
    } else {
      alert('Please enter an email address.');
    }
  }

  // ========== PURCHASE METHODS ==========
  purchaseCredits(packId: string) {
    if (!this.isLoggedIn) {
      this.showError('Please login to purchase credits');
      return;
    }
    alert('🛒 Purchase Credit Pack\n\n200 Credits\n$0.95\n\nRedirecting to payment...');
  }

  subscribePlan(planId: string) {
    if (!this.isLoggedIn) {
      this.showError('Please login to subscribe');
      return;
    }
    alert('📅 Subscribe to Monthly Plan\n\n1,800 Credits per month\n$5.99 / month\n\nRedirecting to payment...');
  }
}