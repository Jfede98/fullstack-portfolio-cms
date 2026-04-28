import { beforeAll } from 'vitest';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as previewAnnotations from './preview';
import "@testing-library/jest-dom/vitest";

const project = setProjectAnnotations([previewAnnotations]);

beforeAll(project.beforeAll);