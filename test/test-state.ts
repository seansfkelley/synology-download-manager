import 'mocha';
import { expect } from 'chai';

import { DownloadStationTask } from 'synology-typescript-api';
import { _updateStateToLatest, State, StateMeta } from '../src/common/state';
import { State_1 } from '../src/common/state/1';
import { State_2 } from '../src/common/state/2';

interface PreVersioningState_0 {
  connection: {
    protocol: 'http' | 'https';
    hostname: string;
    port: number;
    username: string;
    password: string;
  };
  visibleTasks: {
    downloading: boolean;
    uploading: boolean;
    completed: boolean;
    errored: boolean;
    other: boolean;
  };
  notifications: {
    enabled: boolean;
    pollingInterval: number;
  };
  tasks: DownloadStationTask[];
  taskFetchFailureReason: 'missing-config' | { failureMessage: string } | null;
  tasksLastInitiatedFetchTimestamp: number | null;
  tasksLastCompletedFetchTimestamp: number | null;
}

interface PreVersioningState_1 extends PreVersioningState_0 {
  taskSortType: 'name-asc' | 'name-desc' | 'timestamp-completed-asc' | 'timestamp-completed-desc' | 'timestamp-added-asc' | 'timestamp-added-desc' | 'completed-percent-asc' | 'completed-percent-desc';
  shouldHandleDownloadLinks: boolean;
  cachedTasksVersion?: number;
}

const DUMMY_TASK: DownloadStationTask = {
  id: 'id',
  type: 'http',
  username: 'username',
  title: 'title',
  size: 0,
  status: 'downloading',
};

const UP_TO_DATE_STATE: State & StateMeta = {
  connection: {
    protocol: 'http',
    hostname: 'hostname',
    port: 0,
    username: 'username',
    password: 'password',
  },
  visibleTasks: {
    downloading: true,
    uploading: true,
    completed: true,
    errored: true,
    other: true,
  },
  notifications: {
    enableCompletionNotifications: true,
    enableFeedbackNotifications: true,
    completionPollingInterval: 0,
  },
  shouldHandleDownloadLinks: true,
  taskSortType: 'name-asc',
  tasks: [ DUMMY_TASK ],
  taskFetchFailureReason: 'missing-config',
  tasksLastCompletedFetchTimestamp: 0,
  tasksLastInitiatedFetchTimestamp: 0,
};

// TODO: Interface for incorrect-version-2-with-missing-properties?

describe('state versioning', () => {
  it('should update to the latest version from pre-version 0', () => {
    const before: PreVersioningState_0 = {
      connection: {
        protocol: 'http',
        hostname: 'hostname',
        port: 0,
        username: 'username',
        password: 'password',
      },
      visibleTasks: {
        downloading: true,
        uploading: true,
        completed: true,
        errored: true,
        other: true,
      },
      notifications: {
        enabled: true,
        pollingInterval: 0,
      },
      tasks: [ DUMMY_TASK ],
      taskFetchFailureReason: 'missing-config',
      tasksLastCompletedFetchTimestamp: 0,
      tasksLastInitiatedFetchTimestamp: 0,
    };

    expect(_updateStateToLatest(before)).to.deep.equal(UP_TO_DATE_STATE);
  });

  it('should update to the latest version from pre-version 1', () => {
    const before: PreVersioningState_1 = {
      connection: {
        protocol: 'http',
        hostname: 'hostname',
        port: 0,
        username: 'username',
        password: 'password',
      },
      visibleTasks: {
        downloading: true,
        uploading: true,
        completed: true,
        errored: true,
        other: true,
      },
      notifications: {
        enabled: true,
        pollingInterval: 0,
      },
      taskSortType: 'name-asc',
      tasks: [ DUMMY_TASK ],
      taskFetchFailureReason: 'missing-config',
      tasksLastCompletedFetchTimestamp: 0,
      tasksLastInitiatedFetchTimestamp: 0,
      shouldHandleDownloadLinks: true,
      cachedTasksVersion: 0,
    };

    expect(_updateStateToLatest(before)).to.deep.equal(UP_TO_DATE_STATE);
  });

  it('should update to the latest version from version 0 (no state)', () => {
    expect(_updateStateToLatest(null)).to.deep.equal(UP_TO_DATE_STATE);
  });

  it('should update to the latest version from version 1', () => {
    const before: State_1 & StateMeta = {
      connection: {
        protocol: 'http',
        hostname: 'hostname',
        port: 0,
        username: 'username',
        password: 'password',
      },
      visibleTasks: {
        downloading: true,
        uploading: true,
        completed: true,
        errored: true,
        other: true,
      },
      notifications: {
        enabled: true,
        pollingInterval: 0,
      },
      taskSortType: 'name-asc',
      tasks: [ DUMMY_TASK ],
      taskFetchFailureReason: 'missing-config',
      tasksLastCompletedFetchTimestamp: 0,
      tasksLastInitiatedFetchTimestamp: 0,
      shouldHandleDownloadLinks: true,
      stateVersion: 1,
    };

    expect(_updateStateToLatest(before)).to.deep.equal(UP_TO_DATE_STATE);
  });

  it('should update to the latest version from version 2', () => {
    const before: State_2 & StateMeta = {
      connection: {
        protocol: 'http',
        hostname: 'hostname',
        port: 0,
        username: 'username',
        password: 'password',
      },
      visibleTasks: {
        downloading: true,
        uploading: true,
        completed: true,
        errored: true,
        other: true,
      },
      notifications: {
        enableCompletionNotifications: true,
        enableFeedbackNotifications: true,
        completionPollingInterval: 0,
      },
      taskSortType: 'name-asc',
      tasks: [ DUMMY_TASK ],
      taskFetchFailureReason: 'missing-config',
      tasksLastCompletedFetchTimestamp: 0,
      tasksLastInitiatedFetchTimestamp: 0,
      shouldHandleDownloadLinks: true,
      stateVersion: 2,
    };

    expect(_updateStateToLatest(before)).to.deep.equal(UP_TO_DATE_STATE);
  });

  // it('should do nothing when the state is already version 3', () => {
  //   const before: State_3 & StateMeta = {
  //     connection: {
  //       protocol: 'http',
  //       hostname: 'hostname',
  //       port: 0,
  //       username: 'username',
  //       password: 'password',
  //     },
  //     visibleTasks: {
  //       downloading: true,
  //       uploading: true,
  //       completed: true,
  //       errored: true,
  //       other: true,
  //     },
  //     notifications: {
  //       enableCompletionNotifications: true,
  //       enableFeedbackNotifications: true,
  //       completionPollingInterval: 0,
  //     },
  //     taskSortType: 'name-asc',
  //     tasks: [ DUMMY_TASK ],
  //     taskFetchFailureReason: 'missing-config',
  //     tasksLastCompletedFetchTimestamp: 0,
  //     tasksLastInitiatedFetchTimestamp: 0,
  //     shouldHandleDownloadLinks: true,
  //     stateVersion: 2,
  //   };

  //   expect(_updateStateToLatest(before)).to.deep.equal(UP_TO_DATE_STATE);
  // });
});
