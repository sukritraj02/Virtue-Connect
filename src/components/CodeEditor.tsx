import { CODING_QUESTIONS, LANGUAGES } from "@/constants";
import { useState } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import { Badge } from "./ui/badge";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  interviewId: string;
}

function CodeEditor({ interviewId }: CodeEditorProps) {
  const [selectedQuestion, setSelectedQuestion] = useState(CODING_QUESTIONS[0]);
  const [language, setLanguage] = useState<"javascript" | "python" | "java">(LANGUAGES[0].id);
  const [code, setCode] = useState(selectedQuestion.starterCode[language]);

  const handleQuestionChange = (questionId: string) => {
    const question = CODING_QUESTIONS.find((q) => q.id === questionId)!;
    setSelectedQuestion(question);
    const newCode = question.starterCode[language];
    setCode(newCode);
  };

  const handleLanguageChange = (newLanguage: "javascript" | "python" | "java") => {
    setLanguage(newLanguage);
    const newCode = selectedQuestion.starterCode[newLanguage];
    setCode(newCode);
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || "");
  };

  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
      {/* QUESTION SECTION */}
      <ResizablePanel>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose your language and solve the problem
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedQuestion.id} onValueChange={handleQuestionChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {CODING_QUESTIONS.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-4 h-4 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* QUESTION CONTENT */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookIcon className="h-5 w-5" />
                    Problem Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <p>{selectedQuestion.description}</p>
                  </div>

                  {/* EXAMPLES */}
                  {selectedQuestion.examples && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <LightbulbIcon className="h-4 w-4" />
                        Examples
                      </h4>
                      {selectedQuestion.examples.map((example, index) => (
                        <div key={index} className="bg-muted p-3 rounded-md">
                          <p className="text-sm font-medium mb-1">Example {index + 1}:</p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Input: {example.input}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Output: {example.output}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CONSTRAINTS */}
                  {selectedQuestion.constraints && (
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <AlertCircleIcon className="h-4 w-4" />
                        Constraints
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {selectedQuestion.constraints.map((constraint, index) => (
                          <li key={index}>• {constraint}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle />

      {/* CODE EDITOR SECTION */}
      <ResizablePanel defaultSize={60}>
        <div className="h-full">
          <Editor
            height="100%"
            defaultLanguage={language}
            language={language}
            value={code}
            onChange={handleCodeChange}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              automaticLayout: true,
            }}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeEditor;