import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
                  TTS, STT, STS, Cloning & Voice Change
                </span>
              </h1>
              <p class="ud-hero-desc">
                Transform your voice with cutting-edge AI technology. Generate natural speech,
                transcribe audio, clone voices in seconds, and change your voice in real-time.
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

        <!-- TTS Demo with Voice Presets & Emotions -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-volume-up me-2"></i>Text-to-Speech Generator</h3>
          
          <!-- Voice Preset Cards -->
          <div class="row mb-3">
            <div class="col-12">
              <label class="form-label fw-bold">Select Voice Preset:</label>
              <div class="voice-preset-grid">
                <div *ngFor="let preset of voicePresets" 
                     class="voice-preset-card" 
                     [class.active]="selectedVoicePreset === preset.id"
                     (click)="selectVoicePreset(preset.id)">
                  <i [class]="preset.icon"></i>
                  <div class="preset-name">{{preset.name}}</div>
                  <div class="preset-desc">{{preset.description}}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Emotion Selection -->
          <div class="row mb-3">
            <div class="col-12">
              <label class="form-label fw-bold">Select Emotion:</label>
              <div class="emotion-grid">
                <div *ngFor="let emotion of emotions" 
                     class="emotion-card" 
                     [class.active]="selectedEmotion === emotion.id"
                     (click)="selectEmotion(emotion.id)">
                  <span class="emotion-emoji">{{emotion.emoji}}</span>
                  <span class="emotion-name">{{emotion.name}}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-12">
              <textarea [(ngModel)]="ttsText" rows="3" class="form-control" placeholder="Enter your text here..."></textarea>
            </div>
          </div>

          <div class="row mt-3">
            <div class="col-md-6">
              <select [(ngModel)]="selectedLanguage" class="form-control">
                <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
              </select>
            </div>
            <div class="col-md-6">
              <div class="d-flex gap-2">
                <button class="ud-main-btn ud-primary-btn flex-grow-1" (click)="generateEmotionTTS()" [disabled]="isGenerating">
                  <i class="fas" [class.fa-spinner]="isGenerating" [class.fa-play]="!isGenerating"></i>
                  {{isGenerating ? 'Generating...' : 'Generate with Emotion'}}
                </button>
                <button class="ud-main-btn ud-outline-btn" (click)="stopAudio()" *ngIf="isPlaying">
                  <i class="fas fa-stop"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Status & Audio Player -->
          <div class="mt-3" *ngIf="ttsStatus">
            <div class="alert" [class.alert-success]="ttsStatus.includes('success')" 
                 [class.alert-danger]="ttsStatus.includes('failed')" 
                 [class.alert-info]="ttsStatus.includes('Generating')">
              {{ttsStatus}}
            </div>
          </div>

          <div class="mt-3" *ngIf="audioUrl">
            <audio controls class="w-100" #audioPlayer>
              <source [src]="audioUrl" type="audio/wav">
              Your browser does not support the audio element.
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

        <!-- Voice Cloning Card with Hugging Face API -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-clone me-2"></i>Voice Cloning Studio (Hugging Face API)</h3>
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
              <div class="voice-badges mt-3">
                <label class="form-label">Or try sample voices:</label>
                <div>
                  <span class="voice-badge" *ngFor="let speaker of sampleSpeakers" (click)="loadSampleSpeaker(speaker)">
                    🎭 {{speaker}}
                  </span>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <textarea [(ngModel)]="cloneText" rows="3" class="form-control" placeholder="Enter text to speak in cloned voice..."></textarea>
              <div class="mt-3">
                <select [(ngModel)]="selectedSpeakerName" class="form-control mb-2">
                  <option *ngFor="let speaker of speakerNames" [value]="speaker">{{speaker}}</option>
                </select>
                <button class="ud-main-btn ud-primary-btn w-100" (click)="cloneVoiceWithHuggingFace()" [disabled]="isCloning">
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

        <!-- Voice Change for Video Card -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-video me-2"></i>Voice Change for Video</h3>
          <div class="row">
            <div class="col-md-6">
              <div class="video-upload-area" (click)="triggerVideoUpload()" (dragover)="onDragOverVideo($event)" (drop)="onDropVideo($event)">
                <i class="fas fa-video" style="font-size: 48px; color: var(--secondary);"></i>
                <p>Upload video file to change voice</p>
                <small class="text-muted">MP4, AVI, MOV format supported</small>
                <input type="file" #videoInput accept="video/*" (change)="onVideoSelected($event)" style="display: none;">
              </div>
              <div class="mt-3" *ngIf="selectedVideoName">
                <div class="alert alert-info">
                  <i class="fas fa-video me-2"></i>
                  Video: {{selectedVideoName}}
                </div>
              </div>
              <div class="mt-3">
                <label class="form-label">Voice Effect for Video:</label>
                <select [(ngModel)]="videoVoiceEffect" class="form-control mb-2">
                  <option value="robot">🤖 Robot Voice</option>
                  <option value="chipmunk">🐿️ Chipmunk Voice</option>
                  <option value="demon">👿 Demon Voice</option>
                  <option value="alien">👽 Alien Voice</option>
                  <option value="deep">🎙️ Deep Voice</option>
                  <option value="helium">🎈 Helium Voice</option>
                </select>
                <button class="ud-main-btn ud-secondary-btn w-100" (click)="changeVideoVoice()" [disabled]="isProcessingVideo">
                  <i class="fas" [class.fa-spinner]="isProcessingVideo" [class.fa-magic]="!isProcessingVideo"></i>
                  {{isProcessingVideo ? 'Processing...' : 'Change Voice in Video'}}
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="video-preview" *ngIf="videoPreviewUrl">
                <video controls class="w-100" [src]="videoPreviewUrl"></video>
                <button class="btn btn-sm btn-outline-primary mt-2 w-100" (click)="downloadProcessedVideo()">
                  <i class="fas fa-download me-1"></i>Download Video with New Voice
                </button>
              </div>
              <div class="video-placeholder" *ngIf="!videoPreviewUrl">
                <i class="fas fa-film" style="font-size: 48px; color: rgba(139, 92, 246, 0.3);"></i>
                <p>Preview will appear here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Simple AI Video Generation Card -->
        <div class="demo-card mb-4" data-aos="fade-up">
          <h3 class="demo-title"><i class="fas fa-play-circle me-2"></i>Simple AI Video Generator</h3>
          <div class="row">
            <div class="col-md-7">
              <textarea [(ngModel)]="videoScript" rows="4" class="form-control" placeholder="Enter your video script..."></textarea>
              <div class="row mt-3">
                <div class="col-md-6">
                  <select [(ngModel)]="videoAvatar" class="form-control">
                    <option value="professional">👔 Professional Speaker</option>
                    <option value="friendly">😊 Friendly Presenter</option>
                    <option value="energetic">⚡ Energetic Host</option>
                    <option value="calm">🧘 Calm Narrator</option>
                    <option value="cartoon">🎨 Cartoon Character</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <select [(ngModel)]="videoVoicePreset" class="form-control">
                    <option value="female_warm">Female Warm Voice</option>
                    <option value="male_deep">Male Deep Voice</option>
                    <option value="neutral">Neutral Voice</option>
                  </select>
                </div>
              </div>
              <div class="row mt-2">
                <div class="col-md-6">
                  <select [(ngModel)]="videoEmotion" class="form-control">
                    <option *ngFor="let emotion of emotions" [value]="emotion.id">{{emotion.emoji}} {{emotion.name}}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <select [(ngModel)]="videoLanguage" class="form-control">
                    <option *ngFor="let lang of languages" [value]="lang.code">{{lang.name}}</option>
                  </select>
                </div>
              </div>
              <button class="ud-main-btn ud-primary-btn w-100 mt-3" (click)="generateSimpleVideo()" [disabled]="isGeneratingVideo">
                <i class="fas" [class.fa-spinner]="isGeneratingVideo" [class.fa-film]="!isGeneratingVideo"></i>
                {{isGeneratingVideo ? 'Generating Video...' : 'Generate AI Video'}}
              </button>
            </div>
            <div class="col-md-5">
              <div class="video-preview" *ngIf="generatedVideoUrl">
                <video controls class="w-100" [src]="generatedVideoUrl"></video>
                <button class="btn btn-sm btn-outline-primary mt-2 w-100" (click)="downloadGeneratedVideo()">
                  <i class="fas fa-download me-1"></i>Download Video
                </button>
              </div>
              <div class="video-placeholder" *ngIf="!generatedVideoUrl">
                <i class="fas fa-video" style="font-size: 48px; color: rgba(139, 92, 246, 0.3);"></i>
                <p>Your AI generated video will appear here</p>
                <small class="text-muted">Create professional videos with AI avatars</small>
              </div>
            </div>
          </div>
          <div class="mt-3" *ngIf="videoGenerationStatus">
            <div class="alert alert-info">{{videoGenerationStatus}}</div>
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
              <button class="ud-main-btn ud-outline-btn w-100" (click)="uploadAudio()">
                <i class="fas fa-upload me-2"></i>Upload Audio File
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
            <p class="mt-3">Join thousands of creators, developers, and businesses using Awaaz AI Suite.</p>
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
            <p>Awaaz AI Suite - Complete Voice AI Platform for creators and businesses.</p>
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
          <p class="mb-0">© 2024 Awaaz AI Suite. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  navbarOpen = false;
  
  // API Configuration
  private readonly HF_API_URL = 'https://shkahmed-backend.hf.space/synthesize';
  
  features = [
    { icon: 'fas fa-volume-up', title: 'Text-to-Speech (TTS)', description: 'Convert any text into natural, human-like speech with 100+ voices in 50+ languages.', badge: '200+ Voices', type: 'tts' },
    { icon: 'fas fa-microphone', title: 'Speech-to-Text (STT)', description: 'Accurately transcribe audio and video files with real-time streaming support.', badge: '98% Accuracy', type: 'stt' },
    { icon: 'fas fa-exchange-alt', title: 'Speech-to-Speech (STS)', description: 'Translate speech to another language while preserving your voice identity.', badge: 'Real-time', type: 'sts' },
    { icon: 'fas fa-clone', title: 'Voice Cloning', description: 'Clone any voice with just 10 seconds of audio. Perfect for personalization.', badge: '10s Sample', type: 'cloning' },
    { icon: 'fas fa-mask', title: 'Real-time Voice Change', description: 'Change your voice in real-time to any character or celebrity voice.', badge: '50+ Effects', type: 'voicechange' },
    { icon: 'fas fa-studio', title: 'Voice Studio', description: 'Professional audio editing and voice processing tools in one dashboard.', badge: 'Pro Tools', type: 'studio' }
  ];

  // Voice Presets
  voicePresets = [
    { id: 'female_warm', name: 'Female Warm', icon: 'fas fa-female', description: 'Soft & Inviting', speakerFile: 'female.wav' },
    { id: 'female_bright', name: 'Female Bright', icon: 'fas fa-female', description: 'Energetic & Clear', speakerFile: 'female.wav' },
    { id: 'male_deep', name: 'Male Deep', icon: 'fas fa-male', description: 'Rich & Resonant', speakerFile: 'male.wav' },
    { id: 'male_standard', name: 'Male Standard', icon: 'fas fa-male', description: 'Clear & Natural', speakerFile: 'male.wav' },
    { id: 'neutral', name: 'Neutral', icon: 'fas fa-user', description: 'Balanced & Professional', speakerFile: 'default.wav' }
  ];

  // Emotions
  emotions = [
    { id: 'happy', name: 'Happy', emoji: '😊', speed: 1.1, pitch: 1.05 },
    { id: 'sad', name: 'Sad', emoji: '😢', speed: 0.9, pitch: 0.85 },
    { id: 'angry', name: 'Angry', emoji: '😠', speed: 1.15, pitch: 0.95 },
    { id: 'excited', name: 'Excited', emoji: '🤩', speed: 1.2, pitch: 1.15 },
    { id: 'calm', name: 'Calm', emoji: '😌', speed: 0.85, pitch: 0.9 },
    { id: 'fearful', name: 'Fearful', emoji: '😨', speed: 0.95, pitch: 1.1 },
    { id: 'surprised', name: 'Surprised', emoji: '😲', speed: 1.05, pitch: 1.2 },
    { id: 'neutral', name: 'Neutral', emoji: '😐', speed: 1.0, pitch: 1.0 },
    { id: 'friendly', name: 'Friendly', emoji: '🤝', speed: 1.0, pitch: 1.02 },
    { id: 'authoritative', name: 'Authoritative', emoji: '👔', speed: 0.92, pitch: 0.88 }
  ];

  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' }
  ];

  pricingPlans = [
    { name: 'Free', price: '$0', period: '/month', features: ['10 minutes TTS/month', '5 minutes STT/month', 'Basic voices only', 'Community support'], popular: false, link: '#demo' },
    { name: 'Pro', price: '$19', period: '/month', features: ['500 minutes TTS', '200 minutes STT', 'Voice cloning (10 voices)', 'AI Video Generation', 'Priority support'], popular: true, link: '#demo' },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited usage', 'Custom voice training', 'API access', 'Custom AI Avatars', 'Dedicated support'], popular: false, link: '#contact' }
  ];

  effects = [
    { value: 'robot', label: 'Robot' },
    { value: 'chipmunk', label: 'Chipmunk' },
    { value: 'demon', label: 'Demon' },
    { value: 'alien', label: 'Alien' }
  ];

  // Voice Cloning Properties
  sampleSpeakers = ['kajal', 'priya', 'raju', 'amit'];
  speakerNames = ['kajal', 'priya', 'raju', 'amit', 'default'];
  selectedSpeakerName = 'kajal';
  
  cloneText = '';
  cloneLanguage = 'en';
  cloneStatus = '';
  isCloning = false;
  cloneAudioUrl: string | null = null;
  cloneAudioBlob: Blob | null = null;
  selectedFile: File | null = null;
  selectedFileName: string = '';

  // TTS Properties
  ttsText = "Oh yes, the deep sea: nature's basement. Home to creatures so bizarre, even nightmares are like 'Nah, I'll pass.'";
  selectedVoicePreset = 'female_warm';
  selectedEmotion = 'happy';
  selectedLanguage = 'en';
  ttsStatus = '';
  isGenerating = false;
  isPlaying = false;
  audioUrl: string | null = null;
  audioBlob: Blob | null = null;
  speakerWavFile: File | null = null;
  speakerWavName: string = '';
  private audioElement: HTMLAudioElement | null = null;
  
  // Video Voice Change Properties
  selectedVideoFile: File | null = null;
  selectedVideoName: string = '';
  videoVoiceEffect = 'robot';
  isProcessingVideo = false;
  videoPreviewUrl: string | null = null;
  processedVideoBlob: Blob | null = null;
  
  // Simple Video Generation Properties
  videoScript = '';
  videoAvatar = 'professional';
  videoVoicePreset = 'female_warm';
  videoEmotion = 'happy';
  videoLanguage = 'en';
  isGeneratingVideo = false;
  generatedVideoUrl: string | null = null;
  generatedVideoBlob: Blob | null = null;
  videoGenerationStatus = '';
  
  // STT Properties
  isRecording = false;
  sttResult = '';
  mediaRecorder: any;
  audioChunks: any[] = [];
  
  // Voice Change Properties
  selectedEffect = 'robot';
  voiceChangeStatus = '';
  voiceChangeInterval: any;
  
  // Contact Properties
  contactName = '';
  contactEmail = '';
  contactMessage = '';
  newsletterEmail = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

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

  selectVoicePreset(presetId: string) {
    this.selectedVoicePreset = presetId;
    this.ttsStatus = `Voice preset changed to: ${this.voicePresets.find(p => p.id === presetId)?.name}`;
    setTimeout(() => {
      if (this.ttsStatus !== 'Generating...') this.ttsStatus = '';
    }, 2000);
  }

  selectEmotion(emotionId: string) {
    this.selectedEmotion = emotionId;
    this.ttsStatus = `Emotion changed to: ${this.emotions.find(e => e.id === emotionId)?.name}`;
    setTimeout(() => {
      if (this.ttsStatus !== 'Generating...') this.ttsStatus = '';
    }, 2000);
  }

  onSpeakerWavSelected(event: any) {
    this.speakerWavFile = event.target.files[0];
    this.speakerWavName = this.speakerWavFile?.name || '';
  }

  async generateEmotionTTS() {
    if (!this.ttsText.trim()) {
      alert('Please enter some text');
      return;
    }

    this.isGenerating = true;
    this.ttsStatus = 'Generating emotional speech...';
    this.audioUrl = null;

    try {
      const formData = new FormData();
      formData.append('text', this.ttsText);
      formData.append('language', this.selectedLanguage);
      formData.append('emotion', this.selectedEmotion);
      formData.append('voice_preset', this.selectedVoicePreset);
      formData.append('speed', '1.0');
      formData.append('pitch', '1.0');

      const response = await this.http.post(`${this.HF_API_URL}`, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.audioBlob = response.body;
        this.audioUrl = URL.createObjectURL(this.audioBlob);
        this.ttsStatus = 'Audio generated successfully! Playing...';
        this.playAudio();
      } else {
        throw new Error('No audio data received');
      }
    } catch (error: any) {
      console.error('TTS API Error:', error);
      this.ttsStatus = `Generation failed: ${error.message || 'Check if TTS server is running'}`;
    } finally {
      this.isGenerating = false;
    }
  }

  playAudio() {
    if (this.audioUrl) {
      this.stopAudio();
      this.audioElement = new Audio(this.audioUrl);
      this.audioElement.play();
      this.isPlaying = true;
      this.audioElement.onended = () => {
        this.isPlaying = false;
      };
    }
  }

  stopAudio() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.isPlaying = false;
    }
  }

  downloadAudio() {
    if (this.audioBlob && this.audioUrl) {
      const a = document.createElement('a');
      a.href = this.audioUrl;
      a.download = `tts_${this.selectedVoicePreset}_${this.selectedEmotion}_${Date.now()}.wav`;
      a.click();
    } else {
      alert('No audio generated yet. Please generate speech first.');
    }
  }

  clearAudio() {
    this.stopAudio();
    this.audioUrl = null;
    this.audioBlob = null;
    this.ttsStatus = '';
  }

  // Voice Cloning Functions with Hugging Face API
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

  loadSampleSpeaker(speaker: string) {
    this.selectedSpeakerName = speaker;
    this.cloneText = `Hello, this is ${speaker}'s voice. Amazing, isn't it?`;
    this.cloneStatus = `<div class="alert alert-info">${speaker} voice selected! Click "Clone Voice & Generate" to hear it.</div>`;
  }

  async cloneVoiceWithHuggingFace() {
    if (!this.cloneText.trim()) {
      alert('Please enter text to speak');
      return;
    }

    this.isCloning = true;
    this.cloneStatus = '<div class="alert alert-info">Cloning voice and generating speech via Hugging Face API...</div>';

    try {
      const formData = new FormData();
      formData.append('text', this.cloneText);
      formData.append('speaker_name', this.selectedSpeakerName);

      // If user uploaded a custom file, use it instead of speaker_name
      if (this.selectedFile) {
        formData.append('speaker_wav', this.selectedFile);
      }

      const response = await this.http.post(this.HF_API_URL, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (response && response.body) {
        this.cloneAudioBlob = response.body;
        this.cloneAudioUrl = URL.createObjectURL(this.cloneAudioBlob);
        this.cloneStatus = '<div class="alert alert-success">Voice cloned successfully! Audio ready via Hugging Face.</div>';
        
        // Auto-play
        const audio = new Audio(this.cloneAudioUrl);
        audio.play();
      } else {
        throw new Error('No audio data received from Hugging Face API');
      }
    } catch (error: any) {
      console.error('Hugging Face Clone Error:', error);
      this.cloneStatus = `<div class="alert alert-danger">Cloning failed: ${error.message || 'Please check if the Hugging Face backend is running'}</div>`;
    } finally {
      this.isCloning = false;
    }
  }

  downloadCloneAudio() {
    if (this.cloneAudioBlob && this.cloneAudioUrl) {
      const a = document.createElement('a');
      a.href = this.cloneAudioUrl;
      a.download = `cloned_voice_${this.selectedSpeakerName}_${Date.now()}.wav`;
      a.click();
    } else {
      alert('No audio generated yet. Please clone a voice first.');
    }
  }

  // Video Voice Change Functions
  triggerVideoUpload() {
    const videoInput = document.querySelector('#videoInput') as HTMLInputElement;
    videoInput?.click();
  }

  onDragOverVideo(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDropVideo(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files[0] && files[0].type.startsWith('video/')) {
      this.selectedVideoFile = files[0];
      this.selectedVideoName = this.selectedVideoFile.name;
      this.videoPreviewUrl = URL.createObjectURL(this.selectedVideoFile);
    }
  }

  onVideoSelected(event: any) {
    this.selectedVideoFile = event.target.files[0];
    this.selectedVideoName = this.selectedVideoFile?.name || '';
    if (this.selectedVideoFile) {
      this.videoPreviewUrl = URL.createObjectURL(this.selectedVideoFile);
    }
  }

  async changeVideoVoice() {
    if (!this.selectedVideoFile) {
      alert('Please upload a video file first');
      return;
    }

    this.isProcessingVideo = true;

    // Simulate video voice change processing
    setTimeout(() => {
      this.isProcessingVideo = false;
      alert(`Voice changed to ${this.videoVoiceEffect} effect! (Demo - In production, this would process the video)`);
    }, 3000);
  }

  downloadProcessedVideo() {
    if (this.processedVideoBlob) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(this.processedVideoBlob);
      a.download = `voice_changed_video_${Date.now()}.mp4`;
      a.click();
    } else {
      alert('No processed video available. Please change voice first.');
    }
  }

  // Simple Video Generation Functions
  async generateSimpleVideo() {
    if (!this.videoScript.trim()) {
      alert('Please enter a video script');
      return;
    }

    this.isGeneratingVideo = true;
    this.videoGenerationStatus = 'Generating your AI video... This may take a moment.';

    // First generate TTS audio for the video using Hugging Face API
    try {
      const formData = new FormData();
      formData.append('text', this.videoScript);
      formData.append('speaker_name', this.selectedSpeakerName);

      const audioResponse = await this.http.post(this.HF_API_URL, formData, {
        responseType: 'blob',
        observe: 'response'
      }).toPromise();

      if (audioResponse && audioResponse.body) {
        // Simulate video generation with the audio
        setTimeout(() => {
          // Create a simple video representation (in production, this would combine audio with avatar)
          const videoBlob = new Blob([this.videoScript], { type: 'video/mp4' });
          this.generatedVideoBlob = videoBlob;
          this.generatedVideoUrl = URL.createObjectURL(videoBlob);
          this.videoGenerationStatus = 'Video generated successfully!';
          this.isGeneratingVideo = false;
          
          // Play the audio
          const audio = new Audio(URL.createObjectURL(audioResponse.body!));
          audio.play();
        }, 2000);
      }
    } catch (error: any) {
      console.error('Video generation error:', error);
      this.videoGenerationStatus = `Video generation failed: ${error.message}`;
      this.isGeneratingVideo = false;
    }
  }

  downloadGeneratedVideo() {
    if (this.generatedVideoBlob && this.generatedVideoUrl) {
      const a = document.createElement('a');
      a.href = this.generatedVideoUrl;
      a.download = `ai_generated_video_${Date.now()}.mp4`;
      a.click();
    } else {
      alert('No video generated yet. Please generate a video first.');
    }
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
        console.error('Microphone access denied:', err);
        alert('Please allow microphone access to use STT feature.');
      });
  }

  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  uploadAudio() {
    alert('Upload audio for transcription. Connect to STT API at your Hugging Face endpoint');
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
