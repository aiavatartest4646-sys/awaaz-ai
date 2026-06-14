import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <!-- Header -->
    <header class="ud-header">
      <div class="container">
        <nav class="navbar navbar-expand-lg">
          <a class="navbar-brand" href="#">
            <i class="fas fa-microphone-alt" style="font-size: 28px; color: var(--primary);"></i>
            <span style="font-weight: 700; font-size: 24px; margin-left: 10px;">Awaaz AI</span>
          </a>
          <button class="navbar-toggler" type="button" (click)="toggleNavbar()">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" [class.show]="navbarOpen">
            <ul class="navbar-nav mx-auto">
              <li class="nav-item"><a class="nav-link" href="#home" (click)="scrollTo('home')">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="#features" (click)="scrollTo('features')">Features</a></li>
              <li class="nav-item"><a class="nav-link" href="#demo" (click)="scrollTo('demo')">Demo Studio</a></li>
              <li class="nav-item"><a class="nav-link" href="#pricing" (click)="scrollTo('pricing')">Pricing</a></li>
              <li class="nav-item"><a class="nav-link" href="#contact" (click)="scrollTo('contact')">Contact</a></li>
            </ul>
          </div>
          <div class="navbar-btn d-none d-sm-inline-block">
            <a href="#demo" class="ud-main-btn ud-primary-btn" (click)="scrollTo('demo')">Try Free Demo</a>
          </div>
        </nav>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="ud-hero" id="home">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-7" data-aos="fade-right">
            <div class="ud-hero-content">
              <h1 class="ud-hero-title">
                Complete Voice AI Suite: <br>
                <span class="gradient-text">
                  TTS, STT, Voice Cloning & Emotion
                </span>
              </h1>
              <p class="ud-hero-desc">
                Transform your voice with cutting-edge AI technology. Generate natural speech,
                transcribe audio, and change your voice in real-time.
              </p>
              <div class="ud-hero-buttons">
                <a href="#demo" class="ud-main-btn ud-primary-btn me-3" (click)="scrollTo('demo')">Start Creating Free</a>
                <a href="#features" class="ud-main-btn ud-outline-btn" (click)="scrollTo('features')">Explore Features</a>
              </div>
            </div>
          </div>
          <div class="col-lg-5" data-aos="fade-left">
            <div class="ud-hero-image text-center float-animation">
              <i class="fas fa-head-side-vr" style="font-size: 200px; color: rgba(255,255,255,0.2);"></i>
              <i class="fas fa-microphone-alt" style="font-size: 80px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white;"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="ud-features">
      <div class="container">
        <div class="ud-section-title" data-aos="fade-up">
          <span>What We Offer</span>
          <h2>Complete Voice AI Platform</h2>
          <p>All the tools you need to work with voice AI in one place</p>
        </div>
        <div class="row">
          <div class="col-lg-4 col-md-6" *ngFor="let feature of features; let i = index" data-aos="fade-up" [attr.data-aos-delay]="(i + 1) * 100">
            <div class="ud-single-feature" (click)="scrollToDemo(feature.type)">
              <div class="ud-feature-icon"><i [class]="feature.icon"></i></div>
              <h3 class="ud-feature-title">{{feature.title}}</h3>
              <p>{{feature.description}}</p>
              <span class="badge bg-primary mt-3">{{feature.badge}}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Studio Section -->
    <section id="demo" class="demo-section">
      <div class="container">
        <div class="ud-section-title" data-aos="fade-up">
          <span>Interactive Demo</span>
          <h2>Try Voice AI in Action</h2>
          <p>Experience the power of our voice technology - it's free!</p>
        </div>

        <!-- Simple TTS with Speaker Name Input -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-volume-up me-2"></i>Text-to-Speech Generator</h3>
          
          <div class="row">
            <div class="col-md-12">
              <label class="form-label fw-bold">Enter Text:</label>
              <textarea [(ngModel)]="ttsText" rows="3" class="form-control" placeholder="Enter your text here..."></textarea>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <label class="form-label fw-bold">Speaker Name:</label>
              <input type="text" [(ngModel)]="speakerName" class="form-control" placeholder="Enter speaker name (e.g., female_warm, male_deep, neutral)">
              <small class="text-muted">Available: female_warm, female_bright, male_deep, male_standard, neutral</small>
            </div>
            <div class="col-md-6">
              <label class="form-label fw-bold">Language:</label>
              <select [(ngModel)]="selectedLanguage" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <button class="ud-main-btn ud-primary-btn w-100" (click)="generateSimpleTTS()" [disabled]="isGenerating">
                <i class="fas" [class.fa-spinner]="isGenerating" [class.fa-play]="!isGenerating"></i>
                {{isGenerating ? 'Generating...' : 'Generate Speech'}}
              </button>
            </div>
          </div>

          <div class="mt-3" *ngIf="ttsStatus">
            <div class="alert" [class.alert-success]="ttsStatus.includes('success')" 
                 [class.alert-danger]="ttsStatus.includes('failed')" 
                 [class.alert-info]="ttsStatus.includes('Generating')">
              {{ttsStatus}}
            </div>
          </div>

          <div class="mt-3" *ngIf="audioUrl">
            <audio controls class="w-100">
              <source [src]="audioUrl" type="audio/wav">
            </audio>
            <div class="mt-2 d-flex gap-2">
              <button class="btn btn-sm btn-outline-primary" (click)="downloadAudio()">
                <i class="fas fa-download me-1"></i>Download Audio
              </button>
              <button class="btn btn-sm btn-outline-secondary" (click)="clearAudio()">
                <i class="fas fa-trash me-1"></i>Clear
              </button>
            </div>
          </div>
        </div>

        <!-- TTS with Emotion (Using /synthesize-with-emotion) -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-smile me-2"></i>Emotional Text-to-Speech</h3>
          
          <div class="row">
            <div class="col-md-12">
              <label class="form-label fw-bold">Enter Text:</label>
              <textarea [(ngModel)]="emotionText" rows="3" class="form-control" placeholder="Enter your text here..."></textarea>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-4">
              <label class="form-label fw-bold">Voice Preset:</label>
              <select [(ngModel)]="selectedVoicePreset" class="form-control">
                <option value="female_warm">Female Warm</option>
                <option value="female_bright">Female Bright</option>
                <option value="male_deep">Male Deep</option>
                <option value="male_standard">Male Standard</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">Emotion:</label>
              <select [(ngModel)]="selectedEmotion" class="form-control">
                <option *ngFor="let emotion of emotions" [value]="emotion.id">{{emotion.emoji}} {{emotion.name}}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold">Language:</label>
              <select [(ngModel)]="selectedLanguage" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-12">
              <button class="ud-main-btn ud-primary-btn w-100" (click)="generateEmotionTTS()" [disabled]="isGeneratingEmotion">
                <i class="fas" [class.fa-spinner]="isGeneratingEmotion" [class.fa-smile]="!isGeneratingEmotion"></i>
                {{isGeneratingEmotion ? 'Generating...' : 'Generate Emotional Speech'}}
              </button>
            </div>
          </div>

          <div class="mt-3" *ngIf="emotionStatus">
            <div class="alert" [class.alert-success]="emotionStatus.includes('success')" 
                 [class.alert-danger]="emotionStatus.includes('failed')">
              {{emotionStatus}}
            </div>
          </div>

          <div class="mt-3" *ngIf="emotionAudioUrl">
            <audio controls class="w-100">
              <source [src]="emotionAudioUrl" type="audio/wav">
            </audio>
            <button class="btn btn-sm btn-outline-primary mt-2 w-100" (click)="downloadEmotionAudio()">
              <i class="fas fa-download me-1"></i>Download Audio
            </button>
          </div>
        </div>

        <!-- Voice Cloning (Requires file upload) -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-clone me-2"></i>Voice Cloning Studio</h3>
          <div class="row">
            <div class="col-md-6">
              <div class="cloning-upload-area" (click)="triggerFileUpload()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: var(--primary);"></i>
                <p>Drag & drop or click to upload voice sample</p>
                <small class="text-muted">10-30 seconds recommended (WAV/MP3)</small>
                <input type="file" #fileInput accept="audio/*" (change)="onFileSelected($event)" style="display: none;">
              </div>
              <div class="mt-3" *ngIf="selectedFileName">
                <div class="alert alert-info">
                  <i class="fas fa-file-audio me-2"></i>
                  Selected: {{selectedFileName}}
                  <button class="btn btn-sm btn-outline-danger float-end" (click)="clearSelectedFile()">Remove</button>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <textarea [(ngModel)]="cloneText" rows="3" class="form-control" placeholder="Enter text to speak in cloned voice..."></textarea>
              <div class="mt-3">
                <select [(ngModel)]="cloneLanguage" class="form-control mb-2">
                  <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
                </select>
                <button class="ud-main-btn ud-primary-btn w-100" (click)="cloneVoice()" [disabled]="isCloning">
                  <i class="fas" [class.fa-spinner]="isCloning" [class.fa-magic]="!isCloning"></i>
                  {{isCloning ? 'Cloning & Generating...' : 'Clone Voice & Generate'}}
                </button>
              </div>
              <div class="mt-3" *ngIf="cloneStatus" [innerHTML]="cloneStatus"></div>
              <div class="mt-3" *ngIf="cloneAudioUrl">
                <audio controls class="w-100">
                  <source [src]="cloneAudioUrl" type="audio/wav">
                </audio>
                <button class="btn btn-sm btn-outline-primary mt-2 w-100" (click)="downloadCloneAudio()">
                  <i class="fas fa-download me-1"></i>Download Cloned Audio
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- STT Demo -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-microphone me-2"></i>Speech-to-Text Transcriber</h3>
          <div class="row">
            <div class="col-md-6">
              <button class="ud-main-btn ud-secondary-btn w-100 mb-3" (click)="toggleRecording()">
                <i class="fas fa-circle me-2"></i>{{isRecording ? 'Stop Recording' : 'Start Recording'}}
              </button>
            </div>
            <div class="col-md-6">
              <textarea [(ngModel)]="sttResult" rows="4" class="form-control" placeholder="Transcribed text will appear here..." readonly></textarea>
            </div>
          </div>
        </div>

        <!-- Voice Change Demo -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-mask me-2"></i>Real-time Voice Changer</h3>
          <div class="row">
            <div class="col-md-4">
              <select [(ngModel)]="selectedEffect" class="form-control mb-3">
                <option *ngFor="let effect of effects" [value]="effect.value">{{effect.label}}</option>
              </select>
            </div>
            <div class="col-md-4">
              <button class="ud-main-btn ud-secondary-btn w-100 mb-3" (click)="startVoiceChange()">
                <i class="fas fa-microphone-alt me-2"></i>Start Live Change
              </button>
            </div>
            <div class="col-md-4">
              <button class="ud-main-btn ud-outline-btn w-100" (click)="stopVoiceChange()">
                <i class="fas fa-stop me-2"></i>Stop
              </button>
            </div>
          </div>
          <div class="text-center mt-3" *ngIf="voiceChangeStatus" [innerHTML]="voiceChangeStatus"></div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="ud-pricing">
      <div class="container">
        <div class="ud-section-title" data-aos="fade-up">
          <span>Pricing</span>
          <h2>Choose Your Plan</h2>
          <p>Flexible plans for every need - from creators to enterprises</p>
        </div>
        <div class="row">
          <div class="col-lg-4" *ngFor="let plan of pricingPlans; let i = index" data-aos="fade-up" [attr.data-aos-delay]="(i + 1) * 100">
            <div class="ud-single-pricing" [class.active]="plan.popular">
              <span class="ud-popular-tag" *ngIf="plan.popular">POPULAR</span>
              <h3>{{plan.name}}</h3>
              <h2>{{plan.price}}</h2>
              <p *ngIf="plan.period">{{plan.period}}</p>
              <ul class="list-unstyled mt-4">
                <li *ngFor="let feature of plan.features">✓ {{feature}}</li>
              </ul>
              <a [href]="plan.link" class="ud-main-btn" [class.ud-primary-btn]="plan.popular" [class.ud-outline-btn]="!plan.popular" (click)="scrollTo('demo')">Get Started</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="demo-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-6" data-aos="fade-right">
            <h2>Ready to transform your voice experience?</h2>
            <p class="mt-3">Join thousands of creators, developers, and businesses using Awaaz AI.</p>
            <div class="mt-4">
              <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-primary me-3 fs-4"></i>
                <span>Enterprise-grade security</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-primary me-3 fs-4"></i>
                <span>99.9% uptime guarantee</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="fas fa-check-circle text-primary me-3 fs-4"></i>
                <span>24/7 technical support</span>
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <div class="demo-card">
              <h3>Get in Touch</h3>
              <form (ngSubmit)="sendMessage()">
                <input type="text" [(ngModel)]="contactName" name="name" class="form-control mb-3" placeholder="Your Name" required>
                <input type="email" [(ngModel)]="contactEmail" name="email" class="form-control mb-3" placeholder="Email Address" required>
                <textarea rows="3" [(ngModel)]="contactMessage" name="message" class="form-control mb-3" placeholder="Message" required></textarea>
                <button type="submit" class="ud-main-btn ud-primary-btn w-100">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="ud-footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-4">
            <i class="fas fa-microphone-alt fs-1 mb-3"></i>
            <p>Awaaz AI - Complete Voice AI Platform for creators and businesses.</p>
          </div>
          <div class="col-lg-2">
            <h5>Product</h5>
            <ul class="list-unstyled">
              <li><a href="#features" class="text-white-50 text-decoration-none" (click)="scrollTo('features')">Features</a></li>
              <li><a href="#pricing" class="text-white-50 text-decoration-none" (click)="scrollTo('pricing')">Pricing</a></li>
              <li><a href="#demo" class="text-white-50 text-decoration-none" (click)="scrollTo('demo')">Demo</a></li>
            </ul>
          </div>
          <div class="col-lg-2">
            <h5>Resources</h5>
            <ul class="list-unstyled">
              <li><a href="#" class="text-white-50 text-decoration-none">Documentation</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">API Reference</a></li>
              <li><a href="#" class="text-white-50 text-decoration-none">Blog</a></li>
            </ul>
          </div>
          <div class="col-lg-4">
            <h5>Subscribe to Newsletter</h5>
            <div class="input-group">
              <input type="email" [(ngModel)]="newsletterEmail" class="form-control" placeholder="Your email">
              <button class="btn btn-primary" (click)="subscribeNewsletter()">Subscribe</button>
            </div>
          </div>
        </div>
        <hr class="mt-4">
        <div class="text-center">
          <p class="mb-0">© 2024 Awaaz AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navbarOpen = false;
  
  // API Configuration
  private readonly API_URL = 'https://shkahmed-backend.hf.space';
  
  features = [
    { icon: 'fas fa-volume-up', title: 'Text-to-Speech (TTS)', description: 'Convert any text into natural speech with multiple voices.', badge: '5+ Voices', type: 'tts' },
    { icon: 'fas fa-clone', title: 'Voice Cloning', description: 'Clone any voice with just 10 seconds of audio.', badge: '10s Sample', type: 'cloning' },
    { icon: 'fas fa-smile', title: 'Emotion TTS', description: 'Generate speech with 12 different emotions.', badge: '12 Emotions', type: 'emotion' },
    { icon: 'fas fa-microphone', title: 'Speech-to-Text', description: 'Transcribe audio with high accuracy.', badge: '98% Accuracy', type: 'stt' },
    { icon: 'fas fa-mask', title: 'Real-time Voice Change', description: 'Change your voice to any character.', badge: '50+ Effects', type: 'voicechange' }
  ];

  // Voice options for simple TTS
  voiceOptions = [
    { value: 'female_warm', label: 'Female Warm Voice' },
    { value: 'female_bright', label: 'Female Bright Voice' },
    { value: 'male_deep', label: 'Male Deep Voice' },
    { value: 'male_standard', label: 'Male Standard Voice' },
    { value: 'neutral', label: 'Neutral Voice' }
  ];

  // Emotions
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
    { code: 'hi', name: 'Hindi' },
    { code: 'ur', name: 'Urdu' }
  ];

  pricingPlans = [
    { name: 'Free', price: '$0', period: '/month', features: ['10 minutes TTS/month', 'Basic voices', 'Community support'], popular: false, link: '#demo' },
    { name: 'Pro', price: '$19', period: '/month', features: ['500 minutes TTS', 'Voice cloning', 'All emotions', 'Priority support'], popular: true, link: '#demo' },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited usage', 'Custom voice training', 'Dedicated support'], popular: false, link: '#contact' }
  ];

  effects = [
    { value: 'robot', label: 'Robot' },
    { value: 'chipmunk', label: 'Chipmunk' },
    { value: 'demon', label: 'Demon' },
    { value: 'alien', label: 'Alien' }
  ];

  // Simple TTS Properties
  ttsText: string = "Oh yes, the deep sea: nature's basement. Home to creatures so bizarre, even nightmares are like 'Nah, I'll pass.'";
  speakerName: string = 'female_warm';
  selectedLanguage: string = 'en';
  ttsStatus: string = '';
  isGenerating: boolean = false;
  audioUrl: string | null = null;
  audioBlob: Blob | null = null;
  private audioElement: HTMLAudioElement | null = null;

  // Emotion TTS Properties
  emotionText: string = "I am so excited to see you today!";
  selectedVoicePreset: string = 'female_warm';
  selectedEmotion: string = 'happy';
  emotionStatus: string = '';
  isGeneratingEmotion: boolean = false;
  emotionAudioUrl: string | null = null;
  emotionAudioBlob: Blob | null = null;

  // Voice Cloning Properties
  cloneText: string = 'Hello, this is my cloned voice. Amazing, isn\'t it?';
  cloneLanguage: string = 'en';
  cloneStatus: string = '';
  isCloning: boolean = false;
  cloneAudioUrl: string | null = null;
  cloneAudioBlob: Blob | null = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  // STT Properties
  isRecording: boolean = false;
  sttResult: string = '';
  mediaRecorder: any;
  audioChunks: any[] = [];

  // Voice Change Properties
  selectedEffect: string = 'robot';
  voiceChangeStatus: string = '';
  voiceChangeInterval: any;

  // Contact Properties
  contactName: string = '';
  contactEmail: string = '';
  contactMessage: string = '';
  newsletterEmail: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    import('aos').then(AOS => {
      AOS.init({ duration: 800, once: true });
    });
  }

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

  // Simple TTS using /synthesize-simple endpoint
  async generateSimpleTTS() {
    if (!this.ttsText.trim()) {
      alert('Please enter some text');
      return;
    }

    this.isGenerating = true;
    this.ttsStatus = 'Generating speech...';

    try {
      const formData = new FormData();
      formData.append('text', this.ttsText);
      formData.append('language', this.selectedLanguage);
      formData.append('voice', this.speakerName);

      const response = await this.http.post(`${this.API_URL}/synthesize-simple`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.audioBlob = response.body;
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.ttsStatus = 'Audio generated successfully! Playing...';
        this.playAudio();
      }
    } catch (error: any) {
      console.error('TTS Error:', error);
      this.ttsStatus = `Generation failed: ${error.message || 'Server error'}`;
    } finally {
      this.isGenerating = false;
    }
  }

  // Emotion TTS using /synthesize-with-emotion endpoint
  async generateEmotionTTS() {
    if (!this.emotionText.trim()) {
      alert('Please enter some text');
      return;
    }

    this.isGeneratingEmotion = true;
    this.emotionStatus = 'Generating emotional speech...';

    try {
      const formData = new FormData();
      formData.append('text', this.emotionText);
      formData.append('language', this.selectedLanguage);
      formData.append('emotion', this.selectedEmotion);
      formData.append('voice_preset', this.selectedVoicePreset);
      formData.append('speed', '1.0');
      formData.append('pitch', '1.0');

      const response = await this.http.post(`${this.API_URL}/synthesize-with-emotion`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.emotionAudioBlob = response.body;
        this.emotionAudioUrl = URL.createObjectURL(this.emotionAudioBlob);
        this.emotionStatus = 'Emotional audio generated successfully!';
        
        const audio = new Audio(this.emotionAudioUrl);
        audio.play();
      }
    } catch (error: any) {
      console.error('Emotion TTS Error:', error);
      this.emotionStatus = `Generation failed: ${error.message}`;
    } finally {
      this.isGeneratingEmotion = false;
    }
  }

  // Voice Cloning using /synthesize endpoint
  async cloneVoice() {
    if (!this.cloneText.trim()) {
      alert('Please enter text to speak');
      return;
    }

    if (!this.selectedFile) {
      alert('Please upload a voice sample for cloning');
      return;
    }

    this.isCloning = true;
    this.cloneStatus = '<div class="alert alert-info">Cloning voice and generating speech...</div>';

    try {
      const formData = new FormData();
      formData.append('text', this.cloneText);
      formData.append('language', this.cloneLanguage);
      formData.append('speaker_wav', this.selectedFile);

      const response = await this.http.post(`${this.API_URL}/synthesize`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.cloneAudioBlob = response.body;
        this.cloneAudioUrl = URL.createObjectURL(this.cloneAudioBlob);
        this.cloneStatus = '<div class="alert alert-success">Voice cloned successfully! Audio ready.</div>';
        
        const audio = new Audio(this.cloneAudioUrl);
        audio.play();
      }
    } catch (error: any) {
      console.error('Clone error:', error);
      this.cloneStatus = `<div class="alert alert-danger">Cloning failed: ${error.message}</div>`;
    } finally {
      this.isCloning = false;
    }
  }

  playAudio() {
    if (this.audioUrl) {
      this.stopAudio();
      this.audioElement = new Audio(this.audioUrl);
      this.audioElement.play();
      this.isGenerating = true;
      this.audioElement.onended = () => {
        this.isGenerating = false;
      };
    }
  }

  stopAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isGenerating = false;
    }
  }

  downloadAudio() {
    if (this.audioBlob && this.audioUrl) {
      const a = document.createElement('a');
      a.href = this.audioUrl;
      a.download = `tts_${this.speakerName}_${Date.now()}.wav`;
      a.click();
    }
  }

  downloadEmotionAudio() {
    if (this.emotionAudioBlob && this.emotionAudioUrl) {
      const a = document.createElement('a');
      a.href = this.emotionAudioUrl;
      a.download = `emotional_${this.selectedEmotion}_${Date.now()}.wav`;
      a.click();
    }
  }

  downloadCloneAudio() {
    if (this.cloneAudioBlob && this.cloneAudioUrl) {
      const a = document.createElement('a');
      a.href = this.cloneAudioUrl;
      a.download = `cloned_voice_${Date.now()}.wav`;
      a.click();
    }
  }

  clearAudio() {
    this.stopAudio();
    this.audioUrl = null;
    this.audioBlob = null;
    this.ttsStatus = '';
  }

  // File upload functions for voice cloning
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

  clearSelectedFile() {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.cloneAudioUrl = null;
    this.cloneStatus = '';
  }

  // STT Functions
  toggleRecording() {
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
          this.sttResult = "Transcription would appear here. Connect to your STT API endpoint.";
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

  // Voice Change Functions
  startVoiceChange() {
    this.voiceChangeStatus = `
      <div class="alert alert-success">
        Voice changer active! Effect: ${this.selectedEffect}
      </div>
    `;

    this.voiceChangeInterval = setInterval(() => {
      this.voiceChangeStatus = `
        <div class="alert alert-info">
          Voice effect applied: ${this.selectedEffect} (simulated)
        </div>
      `;
    }, 3000);
  }

  stopVoiceChange() {
    if (this.voiceChangeInterval) {
      clearInterval(this.voiceChangeInterval);
    }
    this.voiceChangeStatus = `
      <div class="alert alert-secondary">
        Voice changer stopped
      </div>
    `;
  }

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
}
