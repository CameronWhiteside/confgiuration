"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CopyIconButton } from "@/components/ui/copy-button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RefreshCw } from "lucide-react";
import type { UuidVersion } from "@/lib/services";

interface UuidFormProps {
	initialVersion: UuidVersion;
	initialCount: number;
	initialUuids: string[];
}

export function UuidForm({ initialVersion, initialCount, initialUuids }: UuidFormProps) {
	const [version, setVersion] = useState(initialVersion);
	const [count, setCount] = useState(initialCount);
	const [uuids, setUuids] = useState(initialUuids);
	const [isPending, startTransition] = useTransition();

	const generate = async () => {
		startTransition(async () => {
			try {
				const res = await fetch(`/api/uuid/generate?version=${version}&count=${count}`);
				const data = await res.json() as { success: boolean; data?: { uuids: string[] } };

				if (data.success && data.data) {
					setUuids(data.data.uuids);
				}
			} catch {
				// Silent fail
			}
		});
	};

	const copyAll = () => {
		navigator.clipboard.writeText(uuids.join("\n"));
	};

	return (
		<Tabs
			value={version}
			onValueChange={(v) => {
				setVersion(v as UuidVersion);
				setUuids([]);
			}}
		>
			<form method="GET" action="/uuid" onSubmit={(e) => { e.preventDefault(); generate(); }}>
				<input type="hidden" name="version" value={version} />

				<div className="flex flex-wrap items-end gap-4 mb-6">
					<TabsList>
						<TabsTrigger value="v4">UUID v4 (random)</TabsTrigger>
						<TabsTrigger value="v7">UUID v7 (timestamp)</TabsTrigger>
					</TabsList>

					<div className="w-24">
						<Input
							label="Count"
							name="count"
							type="number"
							min={1}
							max={100}
							value={count}
							onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
						/>
					</div>

					<Button type="submit" disabled={isPending} className="flex items-center gap-2">
						<RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
						{isPending ? "Generating..." : "Generate"}
					</Button>

					{uuids.length > 1 && (
						<Button type="button" variant="secondary" onClick={copyAll}>
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
			</form>
		</Tabs>
	);
}

function UuidList({ uuids }: { uuids: string[] }) {
	return uuids.length > 0 ? (
		<div className="space-y-2">
			{uuids.map((uuid, i) => (
				<Card key={i} hover={false} className="p-3 flex items-center justify-between group">
					<code className="font-mono text-sm text-foreground">{uuid}</code>
					<CopyIconButton text={uuid} />
				</Card>
			))}
		</div>
	) : (
		<div className="text-center py-16 text-foreground-muted">
			Click Generate to create UUIDs
		</div>
	);
}
