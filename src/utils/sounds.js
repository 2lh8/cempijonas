// Local sound files from src/sounds/

import letsPlayUrl from "../sounds/lets play.mp3";
import mainThemeUrl from "../sounds/main theme.mp3";
import questionLowUrl from "../sounds/sounds_original sounds_100-1000 music.mp3";
import questionMidUrl from "../sounds/2000-32000.mp3";
import question64kUrl from "../sounds/64000 music.mp3";
import questionHighUrl from "../sounds/125000-250000 music.mp3";
import question500kUrl from "../sounds/500000 music.mp3";
import questionMillionUrl from "../sounds/1000000 music.mp3";
import correctAnswerUrl from "../sounds/correct answer.mp3";
import wrongAnswerUrl from "../sounds/wrong answer.mp3";
import finalAnswerUrl from "../sounds/final answer.mp3";
import fiftyFiftyUrl from "../sounds/50-50.mp3";
import phoneAFriendUrl from "../sounds/phone a friend.mp3";
import askTheAudienceUrl from "../sounds/ask the audience.mp3";
import askTheHostUrl from "../sounds/ask the host.mp3";
import newQuestionSectionUrl from "../sounds/new question section.mp3";
const SOUND_URLS = {
  letsPlay: letsPlayUrl,
  mainTheme: mainThemeUrl,
  questionLow: questionLowUrl,    // levels 1,2,3
  questionMid: questionMidUrl,    // levels 4,5,6
  question64k: question64kUrl,   // levels 7,8
  questionHigh: questionHighUrl,  // levels 9,10
  question500k: question500kUrl, // levels 11,12
  questionMillion: questionMillionUrl, // level 13
  correctAnswer: correctAnswerUrl,
  wrongAnswer: wrongAnswerUrl,
  finalAnswer: finalAnswerUrl,
  fiftyFifty: fiftyFiftyUrl,
  phoneAFriend: phoneAFriendUrl,
  askTheAudience: askTheAudienceUrl,
  askTheHost: askTheHostUrl,
  nextQuestion: newQuestionSectionUrl,
  nextQuestionOriginal: newQuestionSectionUrl,
};

class SoundManager {
  constructor() {
    this.sounds = {};
    this.currentBg = null;
    this.allBgAudios = new Set(); // every BG audio we've started (current + fading) so stopBG kills all
    this.bgFading = new Set(); // BG audios currently fading out
    this.bgFadeIntervals = new Map(); // audio -> intervalId
    this.activeSFX = {};
    this.phoneCallAudio = null; // looping "phone a friend" during call
    this.muted = false;
    this.bgVolume = 0.3;
    this.sfxVolume = 0.6;
  }

  _getAudio(key) {
    if (!SOUND_URLS[key]) return null;
    if (!this.sounds[key]) {
      this.sounds[key] = new Audio(SOUND_URLS[key]);
    }
    return this.sounds[key];
  }

  playSFX(key) {
    if (this.muted) return;
    if (key === "fastestFinger") return null; // never play fastest finger
    const audio = new Audio(SOUND_URLS[key]);
    if (!audio) return;
    audio.volume = this.sfxVolume;
    audio.addEventListener("ended", () => {
      delete this.activeSFX[key];
    });
    this.activeSFX[key] = audio;
    audio.play().catch(() => {});
    return audio;
  }

  playSFXFrom(key, startTimeSeconds) {
    if (this.muted) return null;
    if (!SOUND_URLS[key]) return null;
    const audio = new Audio(SOUND_URLS[key]);
    audio.volume = this.sfxVolume;
    audio.currentTime = startTimeSeconds;
    const endKey = `${key}From`;
    audio.addEventListener("ended", () => {
      delete this.activeSFX[endKey];
    });
    this.activeSFX[endKey] = audio;
    audio.play().catch(() => {});
    return audio;
  }

  stopSFX(key, fadeMs = 0) {
    const audio = this.activeSFX[key];
    if (!audio) return;
    delete this.activeSFX[key];

    if (fadeMs <= 0) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }

    const steps = 20;
    const stepMs = fadeMs / steps;
    const volumeStep = audio.volume / steps;
    let step = 0;

    const fade = setInterval(() => {
      step++;
      audio.volume = Math.max(0, audio.volume - volumeStep);
      if (step >= steps) {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
      }
    }, stepMs);
  }

  stopAllSFX() {
    Object.keys(this.activeSFX).forEach((key) => {
      const audio = this.activeSFX[key];
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeSFX = {};
  }

  playPhoneAFriendLoop() {
    if (this.muted) return null;
    this.stopPhoneAFriendLoop(0);
    const audio = new Audio(SOUND_URLS.phoneAFriend);
    audio.volume = this.sfxVolume;
    audio.loop = true;
    audio.play().catch(() => {});
    this.phoneCallAudio = audio;
    return audio;
  }

  stopPhoneAFriendLoop(fadeMs = 300) {
    const audio = this.phoneCallAudio;
    if (!audio) return;
    this.phoneCallAudio = null;
    if (fadeMs <= 0) {
      audio.pause();
      audio.currentTime = 0;
      return;
    }
    const steps = 20;
    const stepMs = fadeMs / steps;
    const volumeStep = audio.volume / steps;
    let step = 0;
    const fade = setInterval(() => {
      step++;
      audio.volume = Math.max(0, audio.volume - volumeStep);
      if (step >= steps) {
        clearInterval(fade);
        audio.pause();
        audio.currentTime = 0;
      }
    }, stepMs);
  }

  // Force-stop all BG audio (current + any still fading out)
  _killAllBG() {
    // Stop every BG we ever started (so level 4+ music is always stopped)
    for (const audio of this.allBgAudios) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.allBgAudios.clear();
    this.currentBg = null;
    for (const [audio, intervalId] of this.bgFadeIntervals) {
      clearInterval(intervalId);
      audio.pause();
      audio.currentTime = 0;
    }
    this.bgFading.clear();
    this.bgFadeIntervals.clear();
  }

  playBG(key, loop = true, fadeInMs = 0) {
    if (key === "fastestFinger") return null; // never play fastest finger
    this._killAllBG();
    if (this.muted) return null;
    const audio = new Audio(SOUND_URLS[key]);
    if (!audio) return null;
    audio.volume = fadeInMs > 0 ? 0 : this.bgVolume;
    audio.loop = loop;
    audio.play().catch(() => {});
    this.currentBg = audio;
    this.allBgAudios.add(audio);

    if (fadeInMs > 0) {
      const steps = 20;
      const stepMs = fadeInMs / steps;
      const volumeStep = this.bgVolume / steps;
      let step = 0;
      const fadeIn = setInterval(() => {
        step++;
        audio.volume = Math.min(this.bgVolume, step * volumeStep);
        if (step >= steps) {
          clearInterval(fadeIn);
          audio.volume = this.bgVolume;
        }
      }, stepMs);
    }
    return audio;
  }

  stopBG(fadeMs = 500) {
    // Stop every level BG (current + any still fading) so we never leave music playing
    const toStop = new Set(this.allBgAudios);
    this.currentBg = null;
    this.allBgAudios.clear();

    if (fadeMs <= 0) {
      for (const audio of toStop) {
        audio.pause();
        audio.currentTime = 0;
      }
      for (const [, intervalId] of this.bgFadeIntervals) clearInterval(intervalId);
      this.bgFading.clear();
      this.bgFadeIntervals.clear();
      return;
    }

    const steps = 20;
    const stepMs = fadeMs / steps;

    for (const audio of toStop) {
      this.bgFading.add(audio);
      const volumeStep = audio.volume / steps;
      let step = 0;
      const intervalId = setInterval(() => {
        step++;
        audio.volume = Math.max(0, audio.volume - volumeStep);
        if (step >= steps) {
          clearInterval(intervalId);
          audio.pause();
          audio.currentTime = 0;
          this.bgFading.delete(audio);
          this.bgFadeIntervals.delete(audio);
        }
      }, stepMs);
      this.bgFadeIntervals.set(audio, intervalId);
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopBG(0);
    }
    return this.muted;
  }

  setMuted(val) {
    this.muted = val;
    if (this.muted) {
      this.stopBG(0);
    }
  }

  stopAll() {
    this.stopBG(0);
    this.stopAllSFX();
    this.stopPhoneAFriendLoop(0);
  }
}

const soundManager = new SoundManager();

// Pagalbinė funkcija: gauti foninės muzikos raktą pagal klausimo lygį (nuo 0)
// 7 music backgrounds across 13 levels:
// 1,2,3 → questionLow (sounds_original 100-1000)
// 4,5,6 → questionMid (2000-32000)
// 7,8 → question64k (64000)
// 9,10 → questionHigh (125000-250000)
// 11,12 → question500k (500000)
// 13 → questionMillion (1000000)
export function getBGKeyForLevel(level) {
  if (level <= 2) return "questionLow";   // levels 1,2,3 (0-indexed: 0,1,2)
  if (level <= 5) return "questionMid";   // levels 4,5,6 (3,4,5)
  if (level <= 7) return "question64k";   // levels 7,8 (6,7)
  if (level <= 9) return "questionHigh";  // levels 9,10 (8,9)
  if (level <= 11) return "question500k"; // levels 11,12 (10,11)
  return "questionMillion";               // level 13 (12)
}

export default soundManager;
