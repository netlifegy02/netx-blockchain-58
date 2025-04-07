
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface HumanVerificationProps {
  onVerified: (verified: boolean) => void;
}

const HumanVerification: React.FC<HumanVerificationProps> = ({ onVerified }) => {
  const [challenge, setChallenge] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    generateChallenge();
  }, []);

  const generateChallenge = () => {
    // Simple math or text-based challenges
    const challenges = [
      { question: "What is 5 + 7?", answer: "12" },
      { question: "What is 8 + 3?", answer: "11" },
      { question: "What is 9 + 6?", answer: "15" },
      { question: "What is 12 - 4?", answer: "8" },
      { question: "What is 15 - 6?", answer: "9" },
      { question: "What color is the sky?", answer: "blue" },
      { question: "What is 2 × 3?", answer: "6" },
      { question: "What is the first letter of 'apple'?", answer: "a" },
      { question: "How many days are in a week?", answer: "7" },
      { question: "What is 4 × 4?", answer: "16" }
    ];
    
    const randomIndex = Math.floor(Math.random() * challenges.length);
    setChallenge(challenges[randomIndex].question);
    
    // Store the expected answer in a hidden field
    // In a real implementation, you'd want to validate this server-side
    const base64Answer = btoa(challenges[randomIndex].answer.toLowerCase());
    (document.getElementById('verification-answer') as HTMLInputElement).value = base64Answer;
  };

  const verifyAnswer = () => {
    setIsLoading(true);
    // Add slight delay to simulate server-side verification
    setTimeout(() => {
      try {
        const expectedAnswer = atob((document.getElementById('verification-answer') as HTMLInputElement).value);
        
        if (userAnswer.toLowerCase().trim() === expectedAnswer) {
          setIsVerified(true);
          onVerified(true);
          toast.success("Human verification successful");
        } else {
          setAttempts(attempts + 1);
          setUserAnswer('');
          
          if (attempts >= 2) {
            // After 3 failed attempts, generate a new challenge
            generateChallenge();
            setAttempts(0);
            toast.error("Too many incorrect attempts. New challenge generated.");
          } else {
            toast.error("Incorrect answer. Please try again.");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("An error occurred during verification. Please try again.");
        generateChallenge();
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      verifyAnswer();
    }
  };

  return (
    <div className="space-y-4">
      {!isVerified ? (
        <div className="space-y-4">
          <div className="text-sm">
            Please complete this challenge to verify you are human:
          </div>
          
          <Card className="p-4">
            <div className="font-medium mb-2">{challenge}</div>
            <div className="flex gap-2">
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Your answer"
                className="flex-1"
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoFocus
              />
              <Button 
                onClick={verifyAnswer} 
                disabled={isLoading || userAnswer.trim() === ''}
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
            <input type="hidden" id="verification-answer" />
          </Card>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-green-600">
          <Check className="h-5 w-5" />
          <span>Verification completed successfully</span>
        </div>
      )}
    </div>
  );
};

export default HumanVerification;
