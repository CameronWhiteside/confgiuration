"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolLayout } from "@/components/layout/tool-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";

function generateUUIDv4(): string {
	return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === "x" ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function generateUUIDv7(): string {
	const timestamp = Date.now();
	const timestampHex = timestamp.toString(16).padStart(12, "0");

	const randomBytes = new Uint8Array(10);
	crypto.getRandomValues(randomBytes);

	randomBytes[0] = (randomBytes[0] & 0x0f) | 0x70;
	randomBytes[2] = (randomBytes[2] & 0x3f) | 0x80;

	const randomHex = Array.from(randomBytes)
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");

	return `${timestampHex.slice(0, 8)}-${timestampHex.slice(8, 12)}-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 20)}`;
}

export default function UuidPage() {
	const [uuids, setUuids] = useState<string[]>([]);
	const [version, setVersion] = useState<"v4" | "v7">("v4");
	const [count, setCount] = useState(1);

	const generate = () => {
		const newUuids: string[] = [];
		const generator = version === "v4" ? generateUUIDv4 : generateUUIDv7;
		for (let i = 0; i < count; i++) {
			newUuids.push(generator());
		}
		setUuids(newUuids);
	};

	const copyAll = () => {
		navigator.clipboard.writeText(uuids.join("\n"));
	};

	return (
		<ToolLayout toolId="uuid">
			<Tabs
				defaultValue="v4"
				onValueChange={(v) => {
					setVersion(v as "v4" | "v7");
					setUuids([]);
				}}
			>
				<div className="flex flex-wrap items-end gap-4 mb-6">
					<TabsList>
						<TabsTrigger value="v4">UUID v4 (random)</TabsTrigger>
						<TabsTrigger value="v7">UUID v7 (timestamp)</TabsTrigger>
					</TabsList>

					<div className="w-24">
						<Input
							label="Count"
							type="number"
							min={1}
							max={100}
							value={count}
							onChange={(e) =>
								setCount(Math.min(100, Math.max(1, Number(e.target.value))))
							}
						/>
					</div>

					<Button onClick={generate} className="flex items-center gap-2">
						<RefreshCw className="w-4 h-4" />
						Generate
					</Button>

					{uuids.length > 1 && (
						<Button variant="secondary" onClick={copyAll}>
							Copy All
						</Button>
					)}
				</div>

				<TabsContent value="v4">
					<UuidList uuids={uuids} />
				</TabsContent>

				<TabsContent value="v7">
					<UuidList uuids={uuids} />
				</TabsContent>
			</Tabs>
		</ToolLayout>
	);
}

function UuidList({ uuids }: { uuids: string[] }) {
	return (
		<AnimatePresence mode="wait">
			{uuids.length > 0 ? (
				<motion.div
					key="list"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className="space-y-2"
				>
					{uuids.map((uuid, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.03 }}
						>
							<Card hover={false} className="p-3 flex items-center justify-between group">
								<code className="font-mono text-sm text-foreground">{uuid}</code>
								<CopyIconButton text={uuid} />
							</Card>
						</motion.div>
					))}
				</motion.div>
			) : (
				<motion.div
					key="empty"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="text-center py-16 text-foreground-muted"
				>
					Click Generate to create UUIDs
				</motion.div>
			)}
		</AnimatePresence>
	);
}
